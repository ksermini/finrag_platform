from fastapi import APIRouter, UploadFile, File, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.file_loader import ingest_document

from app.models.user import User
from app.schemas.users import UserBase
from app.services.rag_service import ALLOWED_MODELS, process_query
from app.schemas.rag import ModelQueryRequest, ModelSelection

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



@router.post("/model")
async def select_model(req: ModelSelection):
    if req.model not in ALLOWED_MODELS:
        return {"error": f"Unsupported model '{req.model}'. Choose from: {', '.join(ALLOWED_MODELS)}"}

    # You can optionally store this in frontend state or a user session
    return {"status": "success", "model": req.model}