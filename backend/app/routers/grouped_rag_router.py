from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.models.audit import AuditLog
from app.models.metadata import GenAIMetadata
from uuid import UUID
from datetime import datetime
import time
from app.services.rag_group_service import run
router = APIRouter(prefix="/rag")

@router.post("/grouped-query")
async def grouped_query(
    query: str = Body(...),
    user_id: str = Body(...),
    group_id: str = Body(...),
    role: str = Body(default="domain expert"),
    db: AsyncSession = Depends(get_db)
):
    return await run(
        query=query,
        user_id=user_id,
        group_id=group_id,
        role=role,
        db=db
    )
