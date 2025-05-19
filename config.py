"""Configuration module for the Agentic Blog App."""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API configuration
API_KEY = os.getenv("NON_REASONING_API_KEY")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "openai/gpt-4-turbo")

# Application settings
DEFAULT_NUM_TOPICS = int(os.getenv("DEFAULT_NUM_TOPICS", "5"))
DEFAULT_AUDIENCE = os.getenv("DEFAULT_AUDIENCE", "general readers interested in technology and innovation")

# Verify required configuration
if not API_KEY:
    print("WARNING: NON_REASONING_API_KEY not found in environment variables!") 