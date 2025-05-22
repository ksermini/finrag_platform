from fastapi import APIRouter
from sqlalchemy.future import select
from datetime import datetime, timedelta
import psutil
import time

from app.db import SessionLocal
from app.models.metadata import GenAIMetadata
from app.models.feedback import Feedback
from app.services.health_monitor import run_health_check

router = APIRouter(prefix="/admin", tags=["Admin"])

boot_time = time.time() - psutil.boot_time()

@router.get("/system-metrics")
async def system_metrics():
    async with SessionLocal() as session:
        since = datetime.utcnow() - timedelta(hours=24)

        result = await session.execute(
            select(GenAIMetadata).where(GenAIMetadata.timestamp > since)
        )
        rows = result.scalars().all()
        if not rows:
            return {
                "query_count": 0,
                "avg_latency": 0,
                "avg_tokens": 0,
                "uptime_sec": boot_time,
                "cpu": psutil.cpu_percent(),
                "mem": psutil.virtual_memory().percent,
            }

        avg_latency = sum(r.latency_ms for r in rows) / len(rows)
        avg_tokens = sum(r.tokens_input + r.tokens_output for r in rows) / len(rows)

        return {
            "query_count": len(rows),
            "avg_latency": round(avg_latency),
            "avg_tokens": round(avg_tokens),
            "uptime_sec": boot_time,
            "cpu": psutil.cpu_percent(),
            "mem": psutil.virtual_memory().percent,
        }

@router.get("/recent-queries")
async def recent_queries():
    async with SessionLocal() as session:
        since = datetime.utcnow() - timedelta(hours=24)
        result = await session.execute(
            select(GenAIMetadata).where(GenAIMetadata.timestamp > since).order_by(GenAIMetadata.timestamp.desc())
        )
        rows = result.scalars().all()
        return [r.to_dict() for r in rows]

@router.get("/alerts")
async def system_alerts():
    return await run_health_check()
