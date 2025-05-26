from fastapi import APIRouter, Depends, HTTPException, Body
from app.models.user import User
from app.services.auth_service import get_current_user
from app.services.group_helpers import get_user_primary_group
from app.vector_store import query_vectorstore_with_group
from app.services.rag_group_service import get_rag_config_for_group
from app.services.rag_service import process_query
from app.services.query_cache import get_cached_answer, set_cached_answer
from app.services.metadata_tracker_db import log_query_db
import time
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db

router = APIRouter(prefix="/rag")

@router.post("/grouped-query")
async def grouped_query(
    query: str = Body(...),
    user_id: str = Body(...),
    group_id: str = Body(...),
    role: str = Body(default="domain expert"),
    db: AsyncSession = Depends(get_db)
):
    from uuid import UUID
    import time
    from datetime import datetime

    group_uuid = UUID(group_id)

    # ✅ Get RAG config
    rag_config = await get_rag_config_for_group(group_uuid)
    temperature = rag_config.temperature if rag_config and rag_config.enabled else 0.7

    # ✅ Cache check
    cached_result = get_cached_answer(user_id, query)
    if cached_result:
            print("✅ Using cached result")
            await log_query_db(
                db,
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

    # ✅ Context from vectorstore
    docs = query_vectorstore_with_group(query, group_id=group_uuid)
    context = "\n\n".join(docs)

    # ✅ Prompt construction
    if rag_config and rag_config.enabled:
        template = rag_config.prompt_template or (
            "You are a helpful {tone} assistant for the group. Use only SOPs and answer concisely."
        )
        system_prompt = template.format(tone=rag_config.tone or "professional")
    else:
        system_prompt = f"You are a helpful {role}. Use only the group’s SOPs."

    # ✅ Run query
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

    # ✅ Insert audit log
    audit = AuditLog(
        user_id=user_id,
        query=query,
        response=result["answer"],
        timestamp=datetime.utcnow
    )
    db.add(audit)
    await db.commit()
    await db.refresh(audit)

    # ✅ Log metadata
    metadata = GenAIMetadata(
        query_id=audit.id,
        user_id=user_id,
        model_name=result.get("model_name", "gpt-4"),
        tokens_input=result.get("tokens_input", 0),
        tokens_output=result.get("tokens_output", 0),
        latency_ms=(end - start) * 1000,
        retrieved_docs_count=result.get("retrieved_docs_count", 0),
        source_type="vector",
        cached=False,
        timestamp=datetime.utcnow
    )
    db.add(metadata)
    await db.commit()

    # ✅ Cache it
    set_cached_answer(user_id, query, result)

    return {"answer": result["answer"], "cached": False}
