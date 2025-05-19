"""
Agentic Blog App - A Streamlit application for automated blog post planning.
Uses LangChain and LangGraph to orchestrate a series of LLM-powered agents.
"""
import streamlit as st
import json
from typing import List, Dict, Any

from states import TopicIdeationState, OutlineGenerationState
from config import DEFAULT_NUM_TOPICS, DEFAULT_AUDIENCE
from agents import create_topic_ideation_graph, create_outline_generation_graph


# Initialize app state
def init_session_state():
    """Initialize Streamlit session state variables."""
    if "theme" not in st.session_state:
        st.session_state.theme = ""
    if "num_topics" not in st.session_state:
        st.session_state.num_topics = DEFAULT_NUM_TOPICS
    if "generated_topics" not in st.session_state:
        st.session_state.generated_topics = []
    if "selected_topic" not in st.session_state:
        st.session_state.selected_topic = ""
    if "target_audience" not in st.session_state:
        st.session_state.target_audience = DEFAULT_AUDIENCE
    if "generated_outline" not in st.session_state:
        st.session_state.generated_outline = None
    if "topic_error" not in st.session_state:
        st.session_state.topic_error = None
    if "outline_error" not in st.session_state:
        st.session_state.outline_error = None


# Function to generate topics
def generate_topics():
    """Generate topic ideas based on the theme."""
    st.session_state.topic_error = None
    
    # Create topic ideation graph
    topic_graph = create_topic_ideation_graph()
    
    # Prepare input state
    inputs = TopicIdeationState(
        original_theme=st.session_state.theme,
        num_suggestions=st.session_state.num_topics
    )
    
    with st.spinner("Generating topic ideas..."):
        try:
            # Execute the graph
            result = topic_graph.invoke(inputs)
            
            # Update session state with results
            st.session_state.generated_topics = result.get("generated_topics", [])
            st.session_state.topic_error = result.get("error_message")
            
        except Exception as e:
            st.session_state.topic_error = f"Error generating topics: {str(e)}"
            st.session_state.generated_topics = []


# Function to generate outline
def generate_outline():
    """Generate blog post outline for the selected topic."""
    st.session_state.outline_error = None
    
    # Create outline generation graph
    outline_graph = create_outline_generation_graph()
    
    # Prepare input state
    inputs = OutlineGenerationState(
        selected_topic=st.session_state.selected_topic,
        target_audience=st.session_state.target_audience
    )
    
    with st.spinner("Generating blog outline..."):
        try:
            # Execute the graph
            result = outline_graph.invoke(inputs)
            
            # Update session state with results
            st.session_state.generated_outline = result.get("generated_outline")
            st.session_state.outline_error = result.get("error_message")
            
        except Exception as e:
            st.session_state.outline_error = f"Error generating outline: {str(e)}"
            st.session_state.generated_outline = None


# Helper to format the outline for display
def format_outline_display(outline: Dict[str, Any]) -> str:
    """Format the outline JSON into readable markdown."""
    if not outline:
        return ""
    
    md = f"# {outline['title_suggestion']}\n\n"
    md += f"## Introduction\n{outline['introduction_hook']}\n\n"
    
    for i, section in enumerate(outline['sections'], 1):
        md += f"## {section['heading']}\n"
        for point in section['key_points']:
            md += f"- {point}\n"
        md += "\n"
    
    md += f"## Conclusion\n{outline['conclusion_summary']}\n\n"
    
    if outline.get('call_to_action'):
        md += f"### Call to Action\n{outline['call_to_action']}\n"
    
    return md


# Main app function
def main():
    """Main Streamlit application."""
    st.set_page_config(
        page_title="Agentic Blog Planner",
        page_icon="📝",
        layout="wide"
    )
    
    init_session_state()
    
    st.title("📝 Agentic Blog Planner")
    st.write("Generate blog post topics and outlines with AI agents")
    
    # Sidebar configuration
    with st.sidebar:
        st.header("Configuration")
        st.text("Set up your blog planning parameters")
        
        # Theme input
        st.text_input(
            "Blog Theme or Topic Area", 
            key="theme",
            placeholder="e.g., Artificial Intelligence in Education",
            help="Enter a general theme or topic area for your blog post"
        )
        
        # Number of topics to generate
        st.slider(
            "Number of Topic Ideas", 
            min_value=1, 
            max_value=10, 
            value=DEFAULT_NUM_TOPICS,
            key="num_topics",
            help="Select how many topic ideas you want to generate"
        )
        
        # Target audience
        st.text_area(
            "Target Audience",
            key="target_audience",
            value=DEFAULT_AUDIENCE,
            help="Describe your target audience to better tailor the content"
        )
        
        # Generate topics button
        st.button(
            "Generate Topic Ideas", 
            on_click=generate_topics,
            disabled=not st.session_state.theme,
            help="Click to generate new topic ideas based on your theme"
        )
    
    # Main content area - split into two columns
    col1, col2 = st.columns([1, 1])
    
    # Column 1: Topic Ideas
    with col1:
        st.header("Topic Ideas")
        
        # Error message if any
        if st.session_state.topic_error:
            st.error(st.session_state.topic_error)
        
        # Display generated topics
        if st.session_state.generated_topics:
            for i, topic in enumerate(st.session_state.generated_topics, 1):
                st.write(f"{i}. {topic}")
                # Add a button to select this topic
                if st.button(f"Select Topic {i}", key=f"select_{i}"):
                    st.session_state.selected_topic = topic
                    # Clear previous outline when selecting a new topic
                    st.session_state.generated_outline = None
        else:
            st.info("Enter a theme and click 'Generate Topic Ideas' to get started.")
    
    # Column 2: Blog Outline
    with col2:
        st.header("Blog Outline")
        
        # Show selected topic
        if st.session_state.selected_topic:
            st.subheader("Selected Topic:")
            st.write(st.session_state.selected_topic)
            
            # Generate outline button
            if st.button("Generate Outline", key="generate_outline"):
                generate_outline()
        
        # Error message if any
        if st.session_state.outline_error:
            st.error(st.session_state.outline_error)
        
        # Display the outline
        if st.session_state.generated_outline:
            st.markdown(format_outline_display(st.session_state.generated_outline))
            
            # Add export options
            st.download_button(
                label="Export Outline as JSON",
                data=json.dumps(st.session_state.generated_outline, indent=2),
                file_name="blog_outline.json",
                mime="application/json"
            )
            
            st.download_button(
                label="Export Outline as Markdown",
                data=format_outline_display(st.session_state.generated_outline),
                file_name="blog_outline.md",
                mime="text/markdown"
            )
        elif not st.session_state.selected_topic:
            st.info("Select a topic from the left panel to generate an outline.")


if __name__ == "__main__":
    main() 