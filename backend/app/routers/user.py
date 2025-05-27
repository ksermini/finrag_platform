from fastapi import APIRouter, UploadFile, File, Depends
from app.models.user import User
from app.dependencies import get_current_user
from app.file_loader import ingest_document

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/upload/")
async def upload_doc(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a document for the authenticated user and embed it into the vector store.

    This endpoint extracts and processes content from the uploaded file and associates
    it with the current user. Group metadata can be included in the future.

    Args:
        file (UploadFile): The file to be uploaded (PDF or text expected).
        current_user (User): The authenticated user.

    Returns:
        dict: Details from the document ingestion process (e.g., chunk count, title).
    """
    return await ingest_document(
        file=file,
        user_id=str(current_user.id),
        # You can also pass group metadata if needed later
        # group_id=current_user.business_group
    )
