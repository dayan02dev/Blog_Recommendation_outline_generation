"""LLM service providers and client initialization."""
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.outputs import ChatGeneration, ChatResult
from typing import Any, Dict, List, Optional, Union

import requests
import json

from config import API_KEY, DEFAULT_MODEL


class SimpleOpenRouter(BaseChatModel):
    """A simple implementation of OpenRouter API for LangChain."""
    
    api_key: str
    model: str
    temperature: float = 0.7
    max_tokens: int = 1500
    
    def _convert_messages_to_dict(self, messages: List[Any]) -> List[Dict[str, str]]:
        """Convert LangChain message objects to API-compatible dictionaries."""
        result = []
        for message in messages:
            if isinstance(message, dict):
                # Already a dict with 'type' and 'content' keys
                if 'type' in message and 'content' in message:
                    msg_type = message['type']
                    if msg_type == 'system':
                        result.append({"role": "system", "content": message['content']})
                    elif msg_type == 'human':
                        result.append({"role": "user", "content": message['content']})
                    elif msg_type == 'ai':
                        result.append({"role": "assistant", "content": message['content']})
                    else:
                        raise ValueError(f"Unknown message type: {msg_type}")
                else:
                    raise ValueError(f"Message dict missing required keys: {message}")
            elif hasattr(message, 'type') and hasattr(message, 'content'):
                # LangChain message object
                msg_type = message.type
                if msg_type == 'system':
                    result.append({"role": "system", "content": message.content})
                elif msg_type == 'human':
                    result.append({"role": "user", "content": message.content})
                elif msg_type == 'ai':
                    result.append({"role": "assistant", "content": message.content})
                else:
                    raise ValueError(f"Unknown message type: {msg_type}")
            else:
                raise ValueError(f"Unsupported message format: {message}")
        return result
    
    def _generate(self, messages: List[Union[Dict, HumanMessage, SystemMessage, AIMessage]], stop: Optional[List[str]] = None, **kwargs) -> ChatResult:
        """Generate chat response using OpenRouter API."""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        # Convert messages to format expected by OpenRouter API
        api_messages = self._convert_messages_to_dict(messages)
        
        payload = {
            "model": self.model,
            "messages": api_messages,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens
        }
        
        if stop:
            payload["stop"] = stop
            
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            data=json.dumps(payload)
        )
        
        if response.status_code != 200:
            raise ValueError(f"Error code: {response.status_code} - {response.json()}")
            
        response_json = response.json()
        
        # Extract the generated text
        message = response_json["choices"][0]["message"]
        content = message.get("content", "")
        
        # Create a ChatGeneration object with AIMessage, not HumanMessage
        generation = ChatGeneration(
            message=AIMessage(content=content),
            generation_info=response_json.get("usage", {})
        )
        
        # Return the ChatResult
        return ChatResult(generations=[generation])
    
    def _llm_type(self) -> str:
        """Return type of LLM."""
        return "openrouter"


def get_llm(model_name=None):
    """
    Initialize and return a LangChain LLM client.
    
    Args:
        model_name (str, optional): The model to use. Defaults to config.DEFAULT_MODEL.
    
    Returns:
        LLM: A LangChain language model client.
    
    Raises:
        ValueError: If API_KEY is not set.
    """
    if not API_KEY:
        raise ValueError(
            "API key environment variable is not set. "
            "Please set it in your .env file or environment variables."
        )
    
    model = model_name or DEFAULT_MODEL
    
    return SimpleOpenRouter(
        api_key=API_KEY,
        model=model,
        temperature=0.7,
        max_tokens=1500,
    ) 