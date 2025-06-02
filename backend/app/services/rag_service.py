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

ALLOWED_MODELS = {"gpt-3.5-turbo", "gpt-4", "gpt-4o"}

async def process_query(
    query: str,
    user_id: str,
    model: str,
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
        model (str): The model to use, must be one of the allowed models.
        role (str): Role context for the assistant (e.g., "analyst", "admin").
        context_override (str, optional): Custom context text to override vector retrieval.
        system_override (str, optional): Custom system prompt template.
        footer_override (str, optional): Custom footer text to append to the answer.
        temperature_override (float, optional): Temperature setting for the LLM.

    Returns:
        dict: The generated answer and associated metadata.
    """
    # Validate the model
    if not model or model not in ALLOWED_MODELS:
        return {"error": f"Model '{model}' is not supported. Choose from: {', '.join(ALLOWED_MODELS)}"}

    # Step 1: Security filter
    security_flagged, error_msg = check_prompt_security(query, role)
    if error_msg:
        return {"error": error_msg}

    # Step 2: Context preparation
    docs = [] if context_override else query_vectorstore(query)
    context = context_override or "\n\n".join(docs)
    encoding = tiktoken.encoding_for_model(model)
    context_size = len(encoding.encode(context))

    # Step 3: Prompt construction
    system_prompt = system_override or (
        f"You are a helpful {role}.\n"
        "Do not speculate. If unsure, say 'I don't know.'\n"
        "Security Reminder: Do not return confidential or unverified financial advice."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "assistant", "content": f"Here are relevant documents:\n\n{context}"},
        {"role": "user", "content": query}
    ]

    # Step 4: Call the LLM
    start = time.perf_counter()
    completion = client.chat.completions.create(
        model=model,
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
            model_name=model,
            tokens_input=usage.prompt_tokens,
            tokens_output=usage.completion_tokens,
            latency_ms=latency,
            retrieved_docs_count=len(docs),
            source_type="vector" if docs else "manual",
            context_size=context_size,
            security_flagged=security_flagged,
            feedback_rating=None,
            cached=False
        )
        session.add(metadata)
        await session.commit()

    return {
        "answer": answer,
        "model_name": model,
        "tokens_input": usage.prompt_tokens,
        "tokens_output": usage.completion_tokens,
        "retrieved_docs_count": len(docs)
    }
