import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Active, verified Gemini models with healthy free-tier quotas
ACTIVE_MODELS = [
    "gemini-3.7-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.8-flash",
]

class RobustLLM:
    """Wrapper that attaches automatic model fallbacks and retry logic to structured output."""
    def __init__(self, models=None):
        self.models = models or ACTIVE_MODELS
        self.api_key = settings.GEMINI_API_KEY

    def with_structured_output(self, schema):
        llms = [
            ChatGoogleGenerativeAI(
                model=m,
                google_api_key=self.api_key,
                temperature=0.7,
                max_retries=5,
            ).with_structured_output(schema)
            for m in self.models
        ]
        primary = llms[0]
        fallbacks = llms[1:]
        # Catch any Exception (including 429 RESOURCE_EXHAUSTED and 503 OVERLOAD) to seamlessly switch models
        return primary.with_fallbacks(fallbacks, exceptions_to_handle=(Exception,))

def get_llm():
    return RobustLLM()
