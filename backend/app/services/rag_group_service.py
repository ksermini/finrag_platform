from sqlalchemy.future import select
from app.db import SessionLocal
from app.models.group_document import RAGGroupConfig
from uuid import UUID
from app.services.rag_service import process_query
from app.services.prompt_builder import build_group_prompt
from app.vector_store import query_vectorstore_with_group
from app.services.query_cache import get_cached_answer, set_cached_answer
from app.services.metadata_tracker_db import log_full_metadata, log_query_db
from app.models.audit import AuditLog
from app.models.metadata import GenAIMetadata
from uuid import UUID
from datetime import datetime
import time

async def run(query: str, user_id: str, group_id: str, role: str, db):
    group_uuid = UUID(group_id)

    # Load RAG config
    rag_config = await get_rag_config_for_group(group_uuid)
    temperature = rag_config.temperature if rag_config and rag_config.enabled else 0.7

    # Cache check
    cached_result = get_cached_answer(user_id, query)
    if cached_result:
        await log_query_db(db=db, query_id=None, user_id=user_id, model_name=cached_result.get("model_name", "unknown"),
                           tokens_input=cached_result.get("tokens_input", 0), tokens_output=cached_result.get("tokens_output", 0),
                           latency_ms=0, retrieved_docs_count=cached_result.get("retrieved_docs_count", 0),
                           source_type="vector", cached=True)
        return {"answer": cached_result["answer"], "cached": True}

    # Context retrieval
    docs = query_vectorstore_with_group(query, group_id=str(group_uuid))
    context = "\n\n".join(docs)

    # Prompt building
    system_prompt = build_group_prompt(rag_config, role)

    # Run the LLM
    start = time.perf_counter()
    result = await process_query(
        query=query,
        user_id=user_id,
        role=role,
        context_override=context,
        system_override=system_prompt,
        temperature_override=temperature
    )
    latency = int((time.perf_counter() - start) * 1000)

    # Save logs
    await log_full_metadata(db, user_id, query, result, docs, role, latency)

    # Cache result
    set_cached_answer(user_id, query, result)

    return {"answer": result["answer"], "cached": False}

async def get_rag_config_for_group(group_id: UUID) -> RAGGroupConfig | None:
    """
    Fetch the RAG configuration for a specific group.

    Args:
        group_id (UUID): The unique identifier of the group.

    Returns:
        RAGGroupConfig | None: The group's RAG configuration object, or None if not found.
    """
    async with SessionLocal() as session:
        result = await session.execute(
            select(RAGGroupConfig).where(RAGGroupConfig.group_id == group_id)
        )
        return result.scalar_one_or_none()

