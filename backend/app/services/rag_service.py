from app.vector_store import query_vectorstore
from app.db import SessionLocal
from app.models.audit import AuditLog
from app.models.metadata import GenAIMetadata
from app.security.prompt_filter import check_prompt_security
from openai import OpenAI
import os
import time
import tiktoken

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
CHAT_MODEL = "gpt-3.5-turbo"


async def process_query(
    query: str,
    user_id: str,
    role: str = "user",
    context_override: str = None,
    system_override: str = None,
    footer_override: str = None,
    temperature_override: float = 0.7
):
    """
    Process a user query using OpenAI's chat model with optional group-aware RAG context.

    Includes a prompt security check layer and appends a transparency footer.

    Args:
        query (str): The user's natural language question.
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
    # Step 1: Security filter
    security_flagged, error_msg = check_prompt_security(query, role)
    if error_msg:
        return {"error": error_msg}

    # Step 2: Context preparation
    docs = [] if context_override else query_vectorstore(query)
    context = context_override or "\n\n".join(docs)
    encoding = tiktoken.encoding_for_model(CHAT_MODEL)
    context_size = len(encoding.encode(context))  # or use token count if tokenizer is available

    # Step 3: Prompt construction
    system_prompt = system_override or f"You are a helpful {role}.\nDo not speculate. If unsure, say 'I don't know.'\nSecurity Reminder: Do not return confidential or unverified financial advice."
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "assistant", "content": f"Here are relevant documents:\n\n{context}"},
        {"role": "user", "content": query}
    ]

    # Step 4: Call the LLM
    start = time.perf_counter()
    completion = client.chat.completions.create(
        model=CHAT_MODEL,
        temperature=temperature_override,
        messages=messages
    )
    latency = int((time.perf_counter() - start) * 1000)

    # Step 5: Append dynamic footer
    answer = completion.choices[0].message.content.strip()
    if footer_override:
        answer += f"\n\n---\n{footer_override}"

    usage = completion.usage

    # Step 6: Logging
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
            context_size=context_size,
            security_flagged=security_flagged,
            feedback_rating=None,
            cached=False  # set by your caching layer if enabled
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
