"""State definitions for LangGraph workflows."""
from typing import TypedDict, List, Dict, Optional, Any, Union


class TopicIdeationState(TypedDict, total=False):
    """State for the topic ideation workflow."""
    original_theme: str
    num_suggestions: int
    generated_topics: Optional[List[str]]
    error_message: Optional[str]


class OutlineGenerationState(TypedDict, total=False):
    """State for the outline generation workflow."""
    selected_topic: str
    target_audience: Optional[str]
    generated_outline: Optional[Dict[str, Any]]
    error_message: Optional[str] 