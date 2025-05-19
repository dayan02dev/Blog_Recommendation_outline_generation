# Agentic Blog Planner

![Agentic Blog Planner](https://img.shields.io/badge/Application-Agentic%20Blog%20Planner-blue)
![LangChain](https://img.shields.io/badge/Built%20with-LangChain-green)
![LangGraph](https://img.shields.io/badge/Built%20with-LangGraph-yellow)
![OpenRouter](https://img.shields.io/badge/API-OpenRouter-purple)

An AI-powered application for generating high-quality blog post topics and outlines using LangChain, LangGraph, and OpenRouter. This app combines a series of specialized AI agents to help content creators rapidly develop structured blog post plans.

## 🌟 Demo

<!-- Insert your video here using one of the approaches described at the end of this README -->

## 🤖 Features

- **Topic Ideation**: Generate creative and relevant blog topic ideas based on a theme or general topic area
- **Audience Targeting**: Customize topics and outlines for specific target audiences
- **Structured Outline Generation**: Create comprehensive blog outlines with sections, key points, and calls-to-action
- **Export Options**: Download outlines as markdown or JSON files for easy integration with your content workflow
- **User-friendly Interface**: Simple Streamlit-based UI for rapid interaction with the AI system

## 🏗️ Architecture

This application uses a modular, agent-based architecture powered by LangGraph:

### 🧠 AI Agents

1. **Topic Ideation Agent**:
   - Takes a general theme and audience as input
   - Generates a list of creative, focused blog topic ideas
   - Ensures topics are clear, specific, and audience-appropriate

2. **Outline Generation Agent**:
   - Takes a selected topic and audience as input
   - Creates a structured blog outline with:
     - Title suggestions
     - Introduction hooks
     - Logical sections with key points
     - Conclusion summaries
     - Relevant calls-to-action (when appropriate)

### 🛠️ Technical Components

- **LangGraph**: Orchestrates the agents into a workflow
- **LangChain**: Manages prompt templates and LLM interactions
- **Streamlit**: Provides the user interface
- **OpenRouter**: Connects to various LLM APIs (Claude, GPT-4, etc.)

## 📋 Setup Instructions

### Prerequisites

1. **Python 3.9+**
2. **OpenRouter API Key**: Create an account at [OpenRouter](https://openrouter.ai) to get an API key

### Installation

1. **Clone this repository**:
   ```bash
   git clone <repository-url>
   cd agentic-blog-planner
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create a `.env` file in the project root**:
   ```
   # API Configuration
   NON_REASONING_API_KEY=your_openrouter_api_key_here
   
   # Model Settings
   DEFAULT_MODEL=openai/gpt-4-turbo
   # Other options: anthropic/claude-3-opus-20240229, google/gemini-pro, etc.
   
   # Application Settings
   DEFAULT_NUM_TOPICS=5
   DEFAULT_AUDIENCE=general readers interested in technology and innovation
   ```

### Running the Application

Launch the Streamlit app with:

```bash
streamlit run app.py
```

The application will be available at `http://localhost:8501` in your web browser.

## 📝 Usage Guide

1. **Enter a Theme**: 
   - Type a general theme or topic area in the sidebar 
   - For example: "AI in Healthcare" or "Sustainable Living"

2. **Customize Settings**:
   - Adjust the number of topic ideas (1-10)
   - Specify your target audience for more tailored content

3. **Generate Topics**:
   - Click "Generate Topic Ideas" to create topic suggestions
   - Review the list of generated topics

4. **Select a Topic**:
   - Choose one of the generated topics by clicking its button
   - The selected topic will appear in the outline section

5. **Create Outline**:
   - Click "Generate Outline" to create a detailed blog post structure
   - Review the outline, including title, sections, and key points

6. **Export**:
   - Download your outline in Markdown format (ready for writing)
   - Or download in JSON format (for programmatic use)

## 🔧 Troubleshooting

- **API Key Issues**: Ensure your OpenRouter API key is correctly set in the `.env` file
- **Model Errors**: If you encounter errors, try changing the model in your `.env` file
- **Dependency Issues**: Make sure all required packages are installed with the correct versions

## 🗂️ Project Structure

```
agentic_blog_app/
├── agents/
│   ├── __init__.py         # Package exports
│   ├── topic_agent.py      # Topic ideation agent
│   └── outline_agent.py    # Outline generation agent
├── app.py                  # Main Streamlit application
├── config.py               # Configuration loader
├── llm_services.py         # LLM client implementation
├── prompts.py              # Centralized prompt templates
├── states.py               # State definitions for LangGraph
├── .env                    # Environment variables (create this)
├── .env.example            # Example environment file
├── requirements.txt        # Project dependencies
└── README.md               # This file
```

## 🛠️ Customization

### Modifying Prompts

Edit `prompts.py` to customize how the agents generate content:

- **Topic Ideation**: Adjust `TOPIC_IDEATION_SYSTEM_PROMPT` to change topic generation behavior
- **Outline Generation**: Modify `OUTLINE_GENERATION_SYSTEM_PROMPT` to alter outline structure

### Changing Models

In your `.env` file, change the `DEFAULT_MODEL` to use different LLMs:

```
DEFAULT_MODEL=anthropic/claude-3-opus-20240229
```

Supported models depend on your OpenRouter subscription and may include:
- `openai/gpt-4-turbo`
- `anthropic/claude-3-opus-20240229` 
- `anthropic/claude-3-sonnet-20240229`
- `google/gemini-pro`
- And more

### UI Customization

Modify `app.py` to change the Streamlit interface, add new features, or adjust the layout.


```markdown
[![Agentic Blog Planner Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://youtu.be/wNNWaEpAj2c)
```
https://github.com/dayan02dev/Blog_Recommendation_outline_generation


## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [LangChain](https://github.com/langchain-ai/langchain) for the LLM framework
- [LangGraph](https://github.com/langchain-ai/langgraph) for the agent orchestration
- [Streamlit](https://streamlit.io/) for the web interface
- [OpenRouter](https://openrouter.ai/) for the LLM API access 