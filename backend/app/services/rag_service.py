from app.vector_store import query_vectorstore
from app.db import SessionLocal
from app.models.audit import AuditLog
from app.models.metadata import GenAIMetadata
from openai import OpenAI
import os
import time

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Cheapest high-quality chat model
CHAT_MODEL = "gpt-3.5-turbo"

async def process_query(query: str, user_id: str, role: str):
    docs = query_vectorstore(query)
    context = "\n\n".join(docs)

    start = time.time()
    completion = client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": f"You are a helpful {role}."},
            {"role": "user", "content": f"{context}\n\nQ: {query}"}
        ]
    )
    latency = int((time.time() - start) * 1000)
    answer = completion.choices[0].message.content.strip()
    usage = completion.usage

    async with SessionLocal() as session:
        audit = AuditLog(user_id=user_id, query=query, answer=answer, source_docs=docs, role=role)
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
            source_type="financial_filing"
        )
        session.add(metadata)
        await session.commit()

    return {"answer": answer}
