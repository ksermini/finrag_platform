from fastapi import APIRouter, UploadFile, File, Body
from app.services.file_loader import ingest_document
from app.services.rag_service import process_query
# from app.services.metadata_tracker import log_upload
from fastapi import Depends
from app.database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.metadata_tracker_db import log_query_db

router = APIRouter(prefix="/user", tags=["User"])

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF or text file, extract content, split into chunks,
    and store embeddings in ChromaDB.
    Also logs operational metadata.
    """
    content = await file.read()
    # log_upload(file.filename, user="default", size_kb=len(content) / 1024)
    await file.seek(0)  # reset file pointer for ingest
    return await ingest_document(file)

from app.services.query_cache import get_cached_answer, set_cached_answer
from app.services.metadata_tracker_db import log_query_db
from sqlalchemy.ext.asyncio import AsyncSession

@router.post("/query/")
async def query_rag(
    query: str = Body(...),
    user_id: str = Body(...),
    role: str = Body(default="analyst"),
    db: AsyncSession = Depends(get_db)
):
    # ✅ Check cache before doing ANYTHING else
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

    # 🔽 Only runs if NOT cached
    import time
    start = time.perf_counter()
    result = await process_query(query, user_id, role)
    end = time.perf_counter()
    latency = (end - start) * 1000

    set_cached_answer(user_id, query, result)
    print("📦 Cached result metadata:", cached_result)

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
