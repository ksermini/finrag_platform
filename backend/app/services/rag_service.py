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
    # Only do a vector search if no custom context is passed
    docs = [] if context_override else query_vectorstore(query)
    context = context_override or "\n\n".join(docs)

    # Use the custom system prompt if available
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
