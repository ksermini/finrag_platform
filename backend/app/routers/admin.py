from fastapi import APIRouter
from sqlalchemy.future import select
from datetime import datetime, timedelta
import psutil
import time

from app.db import SessionLocal
from app.models.metadata import GenAIMetadata
from app.models.feedback import Feedback
from app.services.health_monitor import run_health_check
from fastapi import APIRouter, Query
from app.vector_store import query_vectorstore

from app.vector_store import query_vectorstore, client

router = APIRouter(prefix="/admin", tags=["Admin"])

boot_time = time.time() - psutil.boot_time()

router = APIRouter(prefix="/admin", tags=["Admin"])

boot_time = time.time() - psutil.boot_time()
from app.vector_store import client
# ✅ System Metrics Endpoint


# ✅ Vector Search Endpoint
@router.get("/vector-search")
def vector_search(q: str = Query(...)):
    try:
        results = query_vectorstore(q)
        return {"documents": results}
    except Exception as e:
        return {"error": str(e)}

# ✅ Chroma Vector Index Metadata
@router.get("/chroma/index")
def chroma_index():
    try:
        collection = client.get_or_create_collection(name="financial_docs")
        return {
            "collection": collection.name,
            "vector_count": collection.count()
        }
    except Exception as e:
        return {"error": str(e)}

# ✅ Audit Logs (Last 50 Entries)
@router.get("/audit/logs")
async def audit_logs():
    async with SessionLocal() as session:
        result = await session.execute(
            select(GenAIMetadata).order_by(GenAIMetadata.timestamp.desc()).limit(50)
        )
        rows = result.scalars().all()
        return [r.to_dict() for r in rows]

# ✅ API Logs Summary (Text Format)
@router.get("/logs/api")
async def api_logs():
    async with SessionLocal() as session:
        result = await session.execute(
            select(GenAIMetadata).order_by(GenAIMetadata.timestamp.desc()).limit(100)
        )
        rows = result.scalars().all()
        return [
            f"[{r.timestamp}] {r.user_id} | {r.model_name} | {r.latency_ms}ms | {r.tokens_input}+{r.tokens_output} tokens"
            for r in rows
        ]

@router.get("/system-metrics")
async def system_metrics():
    async with SessionLocal() as session:
        since = datetime.utcnow() - timedelta(hours=24)
        result = await session.execute(select(GenAIMetadata).where(GenAIMetadata.timestamp > since))
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

        avg_latency = sum(r.latency_ms or 0 for r in rows) / len(rows)
        avg_tokens = sum((r.tokens_input or 0) + (r.tokens_output or 0) for r in rows) / len(rows)

        return {
            "query_count": len(rows),
            "avg_latency": avg_latency,
            "avg_tokens": avg_tokens,
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


