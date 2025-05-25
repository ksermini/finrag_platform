# app/routers/user.py

from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db

router = APIRouter(prefix="/user", tags=["User"])

@router.post("/upload/")
async def upload_user_file(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    contents = await file.read()
    # handle/save/process the contents here
    return {"filename": file.filename, "size": len(contents)}
