import time
from uuid import UUID
from sqlalchemy.future import select
from app.db import SessionLocal
from app.models.group_document import RAGGroupConfig
from app.services.rag_service import process_query
from app.services.prompt_builder import build_group_prompt
from app.vector_store import query_vectorstore_with_group
from app.services.query_cache import get_cached_answer, set_cached_answer
from app.services.metadata_tracker_db import log_full_metadata, log_query_db


async def run(
    query: str,
    user_id: str,
    group_id: str,
    role: str,
    model: str, 
    db
):
    """
    Execute a group-aware Retrieval-Augmented Generation (RAG) query with caching, 
    context filtering, prompt customization, and OpenAI integration.

    Args:
        query (str): The user's input question.
        user_id (str): The ID of the user submitting the query.
        group_id (str): The ID of the group context to isolate document retrieval.
        role (str): Role context to influence prompt generation (e.g., "analyst").
        model (str): The OpenAI model to use.
        db (AsyncSession): SQLAlchemy async session for audit logging.

    Returns:
        dict: {
            "answer": <str>,
            "cached": <bool>
        }

    Raises:
        RuntimeError: If any error occurs during processing.
    """
    group_uuid = UUID(group_id)

    try:
        print(f"[RAG START] user_id={user_id}, group_id={group_id}, role={role}")

        # Load RAG config
        rag_config = await get_rag_config_for_group(group_uuid)
        temperature = rag_config.temperature if rag_config and rag_config.enabled else 0.7
        print(f"[RAG CONFIG] Loaded config: enabled={rag_config.enabled if rag_config else 'default'}, temp={temperature}")

        # Check cache
        cached_result = get_cached_answer(user_id, query)
        if cached_result:
            print(f"[CACHE HIT] user={user_id}, query={query}")
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

        # Vector context
        docs = query_vectorstore_with_group(query, group_id=str(group_uuid))
        print(f"[VECTOR] Retrieved {len(docs)} documents")
        context = "\n\n".join(docs)

        # Prompt
        system_prompt = build_group_prompt(rag_config, role)
        print(f"[PROMPT] System prompt built for role={role}")

        # Run OpenAI
        start = time.perf_counter()
        result = await process_query(
            query=query,
            user_id=user_id,
            model=model,  # ✅ Now passed correctly
            role=role,
            context_override=context,
            system_override=system_prompt,
            footer_override=None,
            temperature_override=temperature
        )
        latency = int((time.perf_counter() - start) * 1000)
        print(f"[LLM SUCCESS] latency={latency}ms, tokens={result.get('tokens_input', 0)}→{result.get('tokens_output', 0)}")

        # Log metadata
        await log_full_metadata(db, user_id, query, result, docs, role, latency)

        # Cache the result
        set_cached_answer(user_id, query, result)

        return {"answer": result["answer"], "cached": False}

    except Exception as e:
        print(f"[RAG ERROR] user_id={user_id}, group_id={group_id}, error={str(e)}")
        raise RuntimeError("An internal error occurred while processing the query. Please try again.")


async def get_rag_config_for_group(group_id: UUID) -> RAGGroupConfig | None:
    """
    Fetch the RAG config for a given group.

    Args:
        group_id (UUID): Group identifier.

    Returns:
        RAGGroupConfig or None
    """
    async with SessionLocal() as session:
        result = await session.execute(
            select(RAGGroupConfig).where(RAGGroupConfig.group_id == group_id)
        )
        return result.scalar_one_or_none()
