import os
import logging
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import get_settings

logger = logging.getLogger(__name__)

# Active, verified Gemini models with healthy quotas (tested and operational)
ACTIVE_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
]


def get_current_api_key() -> str:
    """Fetch the latest API key, ensuring updates to .env are picked up immediately."""
    load_dotenv(override=True)
    return os.getenv("GEMINI_API_KEY") or get_settings().GEMINI_API_KEY

class RobustLLM:
    """Wrapper that attaches automatic model fallbacks and retry logic to structured output."""
    def __init__(self, models=None):
        self.models = models or ACTIVE_MODELS
        self.api_key = get_current_api_key()

    def with_structured_output(self, schema):
        llms = [
            ChatGoogleGenerativeAI(
                model=m,
                google_api_key=self.api_key,
                temperature=0.7,
                max_retries=1,
            ).with_structured_output(schema)
            for m in self.models
        ]
        primary = llms[0]
        fallbacks = llms[1:]
        # Seamlessly fallback across models if rate limit or overload occurs
        return primary.with_fallbacks(fallbacks, exceptions_to_handle=(Exception,))

def get_llm():
    return RobustLLM()

