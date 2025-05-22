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
    """
        Async function that accepts a query from a user
        Gets the user_id
        includes a role for system prompt context
    """
    # Searches the vector store using the users query
    # Returns a list of similar docs used as context
    docs = query_vectorstore(query)
    # joins the matches docs into a signle context block separated by line breaks
    context = "\n\n".join(docs)

    # Recording to measure latency
    start = time.time()
    completion = client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            # Framework tells the model what role to play
            {"role": "system", "content": f"You are a helpful {role}."},
            # The user message includes both the retrieved context and the actual query
            # The model will consider both
            {"role": "user", "content": f"{context}\n\nQ: {query}"}
        ]
    )
    latency = int((time.time() - start) * 1000)
    # Extracts the generated answer from the first choice and strips whitespace
    answer = completion.choices[0].message.content.strip()
    # Gets token usage metadata (prompt tokens, completion tokens, total)
    usage = completion.usage

    async with SessionLocal() as session:
        # Log to the db
        # Adds the audit log to the db and flushes it (needed to get audit.id for fk)
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

    return {
        "answer": answer,
        "model_name": CHAT_MODEL,  # or detect dynamically
        "tokens_input": usage.prompt_tokens,
        "tokens_output": usage.completion_tokens,
        "retrieved_docs_count": len(docs)
    }

