from app.vector_store import query_vectorstore
from app.db import SessionLocal
from app.models.audit import AuditLog
from app.models.metadata import GenAIMetadata
from openai import OpenAI
import os
import time

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
CHAT_MODEL = "gpt-3.5-turbo"


async def process_query(
    query: str,
    user_id: str,
    role: str = "user",
    context_override: str = None,
    system_override: str = None,
    temperature_override: float = 0.7
):
    """
    Process a user query using OpenAI's chat model with optional group-aware RAG context.

    If no `context_override` is provided, the system performs a vector search
    to build the context. Optionally, a custom system prompt and temperature
    can also be applied.

    Logs both an audit trail and metadata for observability and performance tracking.

    Args:
        query (str): The user’s natural language question.
        user_id (str): The ID of the user submitting the query.
        role (str): Role context for the assistant (e.g., "analyst", "admin"). Default is "user".
        context_override (str, optional): Custom context text to override vector retrieval.
        system_override (str, optional): Custom system prompt template.
        temperature_override (float, optional): Temperature setting for the LLM. Default is 0.7.

    Returns:
        dict: A dictionary containing:
            - answer (str): The model's response.
            - model_name (str): Name of the LLM used.
            - tokens_input (int): Number of prompt tokens.
            - tokens_output (int): Number of completion tokens.
            - retrieved_docs_count (int): Number of vector documents retrieved.
    """
    docs = [] if context_override else query_vectorstore(query)
    context = context_override or "\n\n".join(docs)

    system_prompt = system_override or f"You are a helpful {role}."

    start = time.perf_counter()
    completion = client.chat.completions.create(
        model=CHAT_MODEL,
        temperature=temperature_override,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{context}\n\nQ: {query}"}
        ]
    )
    latency = int((time.perf_counter() - start) * 1000)

    answer = completion.choices[0].message.content.strip()
    usage = completion.usage

    async with SessionLocal() as session:
        audit = AuditLog(
            user_id=user_id,
            query=query,
            answer=answer,
            source_docs=docs,
            role=role
        )
        session.add(audit)
        await session.flush()

        metadata = GenAIMetadata(
            query_id=audit.id,
            user_id=user_id,
            model_name=CHAT_MODEL,
            tokens_input=usage.prompt_tokens,
            tokens_output=usage.completion_tokens,
            latency_ms=latency,
            retrieved_docs_count=len(docs),
            source_type="vector" if docs else "manual",
        )
        session.add(metadata)
        await session.commit()

    return {
        "answer": answer,
        "model_name": CHAT_MODEL,
        "tokens_input": usage.prompt_tokens,
        "tokens_output": usage.completion_tokens,
        "retrieved_docs_count": len(docs)
    }
