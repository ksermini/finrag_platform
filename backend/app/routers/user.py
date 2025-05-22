from fastapi import APIRouter, UploadFile, File, Body
from app.services.file_loader import ingest_document
from app.services.rag_service import process_query

router = APIRouter(prefix="/user", tags=["User"])

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF or text file, extract content, split into chunks,
    and store embeddings in ChromaDB.
    """
    return await ingest_document(file)

@router.post("/query/")
async def query_rag(
    query: str = Body(...),
    user_id: str = Body(...),
    role: str = Body(default="analyst")
):
    """
    Run a query against embedded documents using RAG,
    return answer from LLM and log metadata.
    """
    return await process_query(query, user_id, role)
