from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from datetime import datetime, timedelta
from app.db import SessionLocal
from app.models.metadata import GenAIMetadata
from app.models.feedback import Feedback
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

# Check if current user is admin
async def admin_check(user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/system-metrics")
async def system_metrics(user=Depends(admin_check)):
    async with SessionLocal() as session:
        since = datetime.utcnow() - timedelta(hours=24)

        total_queries = await session.execute(
            select(GenAIMetadata).where(GenAIMetadata.timestamp > since)
        )
        rows = total_queries.scalars().all()
        if not rows:
            return {"query_count": 0, "avg_latency": 0, "avg_tokens": 0}

        avg_latency = sum(r.latency_ms for r in rows) / len(rows)
        avg_tokens = sum(r.tokens_input + r.tokens_output for r in rows) / len(rows)

        return {
            "query_count": len(rows),
            "avg_latency": round(avg_latency),
            "avg_tokens": round(avg_tokens)
        }

@router.get("/recent-queries")
async def recent_queries(user=Depends(admin_check)):
    async with SessionLocal() as session:
        since = datetime.utcnow() - timedelta(hours=24)
        result = await session.execute(
            select(GenAIMetadata).where(GenAIMetadata.timestamp > since).order_by(GenAIMetadata.timestamp.desc())
        )
        rows = result.scalars().all()
        return [r.to_dict() for r in rows]
