from fastapi import APIRouter, Depends, HTTPException, Body
from app.models.user import User
from app.services.auth_service import get_current_user
from app.services.group_helpers import get_user_primary_group
from app.vector_store import query_vectorstore_with_group
from app.services.rag_group_service import get_rag_config_for_group
from app.services.rag_service import process_query
from app.services.query_cache import get_cached_answer, set_cached_answer
from app.services.metadata_tracker_db import log_query_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.models.audit import AuditLog
from app.models.metadata import GenAIMetadata
from uuid import UUID
from datetime import datetime
import time

router = APIRouter(prefix="/rag")


@router.post("/grouped-query")
async def grouped_query(
    query: str = Body(...),
    user_id: str = Body(...),
    group_id: str = Body(...),
    role: str = Body(default="domain expert"),
    db: AsyncSession = Depends(get_db)
):
    group_uuid = UUID(group_id)

    # ✅ Load RAG config
    rag_config = await get_rag_config_for_group(group_uuid)
    temperature = rag_config.temperature if rag_config and rag_config.enabled else 0.7

    # ✅ Check cache
    cached_result = get_cached_answer(user_id, query)
    if cached_result:
        print("✅ Using cached result")
        await log_query_db(
            db=db,
            query_id=None,
            user_id=user_id,
            model_name=cached_result.get("model_name", "unknown"),
            tokens_input=cached_result.get("tokens_input", 0),
            tokens_output=cached_result.get("tokens_output", 0),
            latency_ms=0,
            retrieved_docs_count=cached_result.get("retrieved_docs_count", 0),
            source_type="vector",
            cached=True
        )
        return {"answer": cached_result["answer"], "cached": True}

    # ✅ Group-restricted context
    docs = query_vectorstore_with_group(query, group_id=str(group_uuid))
    context = "\n\n".join(docs)

    # ✅ Custom system prompt
    if rag_config and rag_config.enabled:
        prompt_template = rag_config.prompt_template or (
            "You are a helpful {tone} assistant for the group. Use only SOPs and answer concisely."
        )
        system_prompt = prompt_template.format(tone=rag_config.tone or "professional")
    else:
        system_prompt = f"You are a helpful {role}. Use only the group’s SOPs."

    # ✅ Execute model
    start = time.perf_counter()
    result = await process_query(
        query=query,
        user_id=user_id,
        role=role,
        context_override=context,
        system_override=system_prompt,
        temperature_override=temperature
    )
    end = time.perf_counter()

    # ✅ Save audit log
    audit = AuditLog(
        user_id=user_id,
        query=query,
        answer=result["answer"],
        source_docs=docs,
        role=role,
        timestamp=datetime.utcnow()
    )
    db.add(audit)
    await db.flush()

    # ✅ Save GenAI metadata
    metadata = GenAIMetadata(
        query_id=audit.id,
        user_id=user_id,
        model_name=result.get("model_name", "gpt-4"),
        tokens_input=result.get("tokens_input", 0),
        tokens_output=result.get("tokens_output", 0),
        latency_ms=int((end - start) * 1000),
        retrieved_docs_count=result.get("retrieved_docs_count", 0),
        source_type="vector",
        cached="false",
        timestamp=datetime.utcnow()
    )
    db.add(metadata)
    await db.commit()

    # ✅ Cache result
    set_cached_answer(user_id, query, result)

    return {"answer": result["answer"], "cached": False}
