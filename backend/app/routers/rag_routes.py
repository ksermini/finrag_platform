from fastapi import APIRouter, UploadFile, File, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.file_loader import ingest_document

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


