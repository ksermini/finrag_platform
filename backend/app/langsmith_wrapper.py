from functools import wraps
from langsmith.trace_context import trace_context
import os

def with_tracing(name="LangSmith Trace"):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if os.getenv("LANGCHAIN_API_KEY"):
                with trace_context(name=name) as trace:
                    result = await func(*args, **kwargs)
                    result["trace_url"] = trace.url
                    return result
            else:
                return await func(*args, **kwargs)
        return wrapper
    return decorator
