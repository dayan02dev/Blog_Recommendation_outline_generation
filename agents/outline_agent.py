"""Outline generation agent for blog post creation."""
from states import OutlineGenerationState
from llm_services import get_llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from langgraph.graph import StateGraph, END
from langchain_core.messages import SystemMessage, HumanMessage

# Import prompts
from prompts import OUTLINE_GENERATION_SYSTEM_PROMPT, OUTLINE_GENERATION_HUMAN_PROMPT


# Pydantic models for outline structure
class OutlineSection(BaseModel):
    """Represents a section in the blog post outline."""
    heading: str = Field(description="The heading for this section (e.g., H2, H3)")
    key_points: List[str] = Field(description="Bullet points or key ideas for this section")


class BlogOutline(BaseModel):
    """Represents the complete blog post outline structure."""
    title_suggestion: str = Field(description="A catchy title for the blog post")
    introduction_hook: str = Field(description="A brief idea for an engaging introduction")
    sections: List[OutlineSection] = Field(description="The main sections of the blog post")
    conclusion_summary: str = Field(description="A brief idea for the conclusion")
    call_to_action: Optional[str] = Field(default=None, description="A suggested call to action, if applicable")


def generate_outline_node(state: OutlineGenerationState) -> dict:
    """Node to generate a blog post outline."""
    print("---NODE: GENERATE OUTLINE---")
    topic = state["selected_topic"]
    audience = state.get("target_audience") or "a general audience"  # Ensure default if None
    llm = get_llm()  # You could pass a specific model for outlining if desired

    parser = JsonOutputParser(pydantic_object=BlogOutline)
    format_instructions = parser.get_format_instructions()

    # Create properly formatted messages for the LLM
    formatted_system_prompt = OUTLINE_GENERATION_SYSTEM_PROMPT.format(format_instructions=format_instructions)
    formatted_human_prompt = OUTLINE_GENERATION_HUMAN_PROMPT.format(topic=topic, audience=audience)
    
    messages = [
        SystemMessage(content=formatted_system_prompt),
        HumanMessage(content=formatted_human_prompt)
    ]

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
        
        # Parse the response content with JSON parser
        response = parser.invoke(response_text)
        
        return {"generated_outline": response, "error_message": None}
    except Exception as e:
        print(f"Error in generate_outline_node: {e}")
        # Try to capture more info if it's a parsing error
        if "OutputParserException" in str(type(e)):
            print(f"LLM Output likely did not conform to JSON schema. Raw LLM output: {getattr(e, 'llm_output', 'N/A')}")
        return {"generated_outline": None, "error_message": str(e)}


def format_outline_node(state: OutlineGenerationState) -> dict:
    """Node to format outline (currently a pass-through)."""
    print("---NODE: FORMAT OUTLINE---")
    # Could add validation against Pydantic model here if not already done by parser
    if state["generated_outline"]:
        try:
            # Validate it's parseable into our Pydantic model,
            # even if parser already did. This node could do extra transformations.
            BlogOutline(**state["generated_outline"])
        except Exception as e:
            print(f"Error validating outline structure in format_outline_node: {e}")
            return {"error_message": f"Outline structure invalid: {e}"}
    return {}


def create_outline_generation_graph():
    """Create and return the outline generation workflow graph."""
    workflow = StateGraph(OutlineGenerationState)
    workflow.add_node("generate_outline", generate_outline_node)
    workflow.add_node("format_outline", format_outline_node)
    workflow.set_entry_point("generate_outline")
    workflow.add_edge("generate_outline", "format_outline")
    workflow.add_edge("format_outline", END)
    return workflow.compile()


# Example usage for testing
if __name__ == "__main__":
    app = create_outline_generation_graph()
    inputs = OutlineGenerationState(
        selected_topic="Exploring the Ethics of AI in Creative Writing",
        target_audience="writers and AI enthusiasts"
    )
    for event in app.stream(inputs):
        for k, v in event.items():
            print(f"Output from node '{k}':")
            if isinstance(v, dict):  # The value is the full state
                print(f"  Generated Outline: {v.get('generated_outline')}")
                print(f"  Error: {v.get('error_message')}")
            else:
                print(v)
            print("---") 