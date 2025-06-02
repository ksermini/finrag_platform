from fastapi import APIRouter, UploadFile, HTTPException, Depends
from sqlalchemy.future import select
from uuid import UUID
from datetime import datetime
import os
from app.db import SessionLocal
from app.models.group import GroupDocument
from app.models.user import User
from app.services.file_loader import extract_text_from_pdf
from app.vector_store import add_to_vectorstore  # Assumes Chroma integration

from langchain.text_splitter import RecursiveCharacterTextSplitter

router = APIRouter(prefix="/groups", tags=["Group Documents"])


@router.post("/{group_id}/documents")
async def upload_group_document(
    group_id: UUID,
    file: UploadFile,
    current_user: User = Depends(lambda: User(id=0, email="mock@dev.com", is_admin=True, is_active=True))
):
    """
    Upload and embed a PDF document for a specific group.

    This endpoint saves the uploaded PDF, extracts and splits its text,
    pushes it into the vector store for retrieval, and stores metadata in the database.

    Args:
        group_id (UUID): The ID of the group the document belongs to.
        file (UploadFile): The PDF file to upload and process.
        current_user (User): The user uploading the file (default is mock admin for testing).

    Raises:
        HTTPException: If the file is empty or unreadable.

    Returns:
        dict: Confirmation message and number of embedded chunks.
    """
    filename = file.filename
    contents = await file.read()

    # Save file temporarily
    temp_path = f"tmp_{filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)

    try:
        text = extract_text_from_pdf(temp_path)
    finally:
        os.remove(temp_path)

    if not text.strip():
        raise HTTPException(status_code=400, detail="File is empty or could not be read.")

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)

    add_to_vectorstore(
        chunks,
        filename=filename,
        user_id=str(current_user.id),
        group_id=str(group_id)
    )

    new_doc = GroupDocument(
        group_id=group_id,
        title=filename,
        content=text,
        embedded=True,
        created_at=datetime.now()
    )

    async with SessionLocal() as session:
        session.add(new_doc)
        await session.commit()

    return {"message": f"Uploaded and embedded {filename}", "chunks": len(chunks)}


@router.get("/{group_id}/documents")
async def list_group_documents(group_id: UUID):
    """
    List all documents associated with a specific group.

    Args:
        group_id (UUID): The ID of the group whose documents should be listed.

    Returns:
        List[dict]: A list of document metadata including ID, title, embedded status, and creation timestamp.
    """
    async with SessionLocal() as session:
        result = await session.execute(select(GroupDocument).where(GroupDocument.group_id == group_id))
        docs = result.scalars().all()

    return [
        {
            "id": str(doc.id),
            "title": doc.title,
            "embedded": doc.embedded,
            "created_at": doc.created_at.isoformat()
        }
        for doc in docs
    ]
