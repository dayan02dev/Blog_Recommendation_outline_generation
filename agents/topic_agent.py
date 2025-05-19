"""Topic ideation agent for blog post generation."""
from typing import List
from states import TopicIdeationState
from llm_services import get_llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langgraph.graph import StateGraph, END
from langchain_core.messages import SystemMessage, HumanMessage

# Import prompts
from prompts import TOPIC_IDEATION_SYSTEM_PROMPT, TOPIC_IDEATION_HUMAN_PROMPT


def brainstorm_topics_node(state: TopicIdeationState) -> dict:
    """Node to brainstorm blog topics using an LLM."""
    print("---NODE: BRAINSTORM TOPICS---")
    theme = state["original_theme"]
    num_suggestions = state.get("num_suggestions", 5)
    llm = get_llm()

    # Create properly formatted messages for the LLM
    formatted_system_prompt = TOPIC_IDEATION_SYSTEM_PROMPT.format(num_suggestions=num_suggestions)
    formatted_human_prompt = TOPIC_IDEATION_HUMAN_PROMPT.format(theme=theme, num_suggestions=num_suggestions)
    
    messages = [
        SystemMessage(content=formatted_system_prompt),
        HumanMessage(content=formatted_human_prompt)
    ]
    
    parser = StrOutputParser()

    try:
        # Call the LLM directly with the messages
        llm_response = llm.invoke(messages)
        
        # Extract the text from the response
        # The response could be a ChatResult, Message, or a string
        if hasattr(llm_response, 'generations') and llm_response.generations:
            # It's a ChatResult
            response_text = llm_response.generations[0].message.content
        elif hasattr(llm_response, 'content'):
            # It's a Message
            response_text = llm_response.content
        else:
            # Assume it's a string or something we can convert to string
            response_text = str(llm_response)
            
        # Parse the response content
        response = parser.invoke(response_text)
        
        # Basic parsing - ensure robustness
        raw_topics = [topic.strip() for topic in response.split('\n') if topic.strip()]
        generated_topics = []
        for rt in raw_topics:
            # Remove leading numbers like "1. ", "2. ", etc.
            if '.' in rt and rt.split('.', 1)[0].isdigit():
                topic_text = rt.split('.', 1)[1].strip()
                generated_topics.append(topic_text)
            elif rt:  # If no numbering but still valid text
                 generated_topics.append(rt)

        # Ensure we return the requested number of topics, or what was generated
        final_topics = generated_topics[:num_suggestions] if generated_topics else []

        if not final_topics and response:  # If parsing failed but got a response
             print(f"Warning: Could not parse topics as expected. Raw response: {response}")
             # Attempt a more generic split or return raw as a fallback for debugging
             final_topics = [response] if len(response) < 200 else ["Could not parse topics, see logs."]

        return {"generated_topics": final_topics, "error_message": None}
    except Exception as e:
        print(f"Error in brainstorm_topics_node: {e}")
        return {"generated_topics": None, "error_message": str(e)}


def format_topics_node(state: TopicIdeationState) -> dict:
    """Node to format topics (currently a pass-through)."""
    print("---NODE: FORMAT TOPICS---")
    if state["generated_topics"]:
        return {"generated_topics": [t for t in state["generated_topics"] if t]}
    return {}


def create_topic_ideation_graph():
    """Create and return the topic ideation workflow graph."""
    workflow = StateGraph(TopicIdeationState)
    workflow.add_node("brainstorm_topics", brainstorm_topics_node)
    workflow.add_node("format_topics", format_topics_node)
    workflow.set_entry_point("brainstorm_topics")
    workflow.add_edge("brainstorm_topics", "format_topics")
    workflow.add_edge("format_topics", END)
    return workflow.compile()


# Example usage for testing
if __name__ == "__main__":
    app = create_topic_ideation_graph()
    inputs = TopicIdeationState(original_theme="The impact of remote work on team collaboration", num_suggestions=3)
    for event in app.stream(inputs):
        for k, v in event.items():
            print(f"Output from node '{k}':")
            if isinstance(v, dict):  # The value is the full state
                print(f"  Generated Topics: {v.get('generated_topics')}")
                print(f"  Error: {v.get('error_message')}")
            else:  # Should not happen with current LangGraph stream if state is dict
                print(v)
            print("---") 