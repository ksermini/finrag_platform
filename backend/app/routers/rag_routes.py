from fastapi import APIRouter, UploadFile, File, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.file_loader import ingest_document
from app.services.rag_service import process_query
from app.services.query_cache import get_cached_answer, set_cached_answer
from app.services.metadata_tracker_db import log_query_db
from app.database.database import get_db
from app.dependencies import get_current_user
from app.services.group_helpers import get_user_primary_group
from app.models.user import User

router = APIRouter(prefix="/rag", tags=["RAG Operations"])


@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file and embed its contents for RAG.

    Accepts PDF or text files, extracts content, splits into chunks,
    and stores them in the vector database (ChromaDB).

    Args:
        file (UploadFile): The uploaded file.

    Returns:
        dict: Success message or error details.
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
    Execute a vector-based RAG query with caching and metadata logging.

    If the answer is cached, returns the cached result. Otherwise,
    runs a live query using embedded document context and logs metadata.

    Args:
        query (str): User's natural language question.
        user_id (str): ID of the user making the query.
        role (str): Role context for the prompt (default: "analyst").
        db (AsyncSession): SQLAlchemy session dependency.

    Returns:
        dict: The answer and whether it was cached.
    """
    try:
        cached_result = get_cached_answer(user_id, query)
        if cached_result:
            print("Using cached result")
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

        set_cached_answer(user_id, query, result)

        return {"answer": result["answer"], "cached": False}

    except Exception as e:
        return {"error": f"Query failed: {str(e)}"}


@router.get("/group-info")
async def get_group_info(user: User = Depends(get_current_user)):
    """
    Retrieve the primary group info for the authenticated user.

    Args:
        user (User): Injected current user via auth dependency.

    Returns:
        dict: Group metadata including name, default agent role, and user greeting name.
    """
    group = await get_user_primary_group(user.id)
    return {
        "group_id": str(group.id),
        "group_name": group.name,
        "default_agent_role": group.default_agent_role or "domain expert",
        "user_name": user.first_name or "there"
    }


@router.get("/test-token")
async def test_token(user: User = Depends(get_current_user)):
    """
    Simple test endpoint to validate the JWT token.

    Args:
        user (User): The current user from token.

    Returns:
        dict: The user's email to confirm identity.
    """
    return {"email": user.email}
