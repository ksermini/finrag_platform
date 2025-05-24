from fastapi import APIRouter, UploadFile, File, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.file_loader import ingest_document
from app.services.rag_service import process_query
from app.services.query_cache import get_cached_answer, set_cached_answer
from app.services.metadata_tracker_db import log_query_db
from app.database.database import get_db

router = APIRouter(prefix="/rag", tags=["RAG Operations"])


@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF or text file, extract content, split into chunks,
    and store embeddings in ChromaDB.
    """
    try:
        content = await file.read()
        await file.seek(0)  # Reset file pointer for ingestion
        return await ingest_document(file)
    except Exception as e:
        return {"error": f"Failed to process file: {str(e)}"}


@router.post("/query/")
async def query_rag(
    query: str = Body(...),
    user_id: str = Body(...),
    role: str = Body(default="analyst"),
    db: AsyncSession = Depends(get_db)
):
    """
    Run a vector-based RAG query. Caches results and logs metadata.
    """
    try:
        # ✅ Check cache
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

        # 🔍 If not cached, run live query
        import time
        start = time.perf_counter()
        result = await process_query(query, user_id, role)
        end = time.perf_counter()
        latency = (end - start) * 1000

        # Cache it for next time
        set_cached_answer(user_id, query, result)

        # Log the metadata
        await log_query_db(
            db,
            query_id=None,
            user_id=user_id,
            model_name=result.get("model_name", "unknown"),
            tokens_input=result.get("tokens_input", 0),
            tokens_output=result.get("tokens_output", 0),
            latency_ms=latency,
            retrieved_docs_count=result.get("retrieved_docs_count", 0),
            source_type="vector",
            cached=False
        )

        return {"answer": result["answer"], "cached": False}

    except Exception as e:
        return {"error": f"Query failed: {str(e)}"}
