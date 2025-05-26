from fastapi import APIRouter, Query
from sqlalchemy.future import select
from datetime import datetime, timedelta
import psutil
import time
from collections import Counter

from app.db import SessionLocal
from app.models.metadata import GenAIMetadata
from app.models.feedback import Feedback
from app.services.health_monitor import run_health_check
from app.vector_store import query_vectorstore
from chromadb import PersistentClient

router = APIRouter(prefix="/admin", tags=["Admin"])

boot_time = time.time() - psutil.boot_time()


@router.get("/vector-search")
def vector_search(q: str = Query(...)):
    """
    Perform a vector search using the provided query string.

    Args:
        q (str): The query string to search for.

    Returns:
        dict: Retrieved documents or error message.
    """
    try:
        results = query_vectorstore(q)
        return {"documents": results}
    except Exception as e:
        return {"error": str(e)}


@router.get("/audit/logs")
async def audit_logs():
    """
    Fetch the last 50 audit logs from the GenAI metadata table.

    Returns:
        List[dict]: A list of the most recent audit logs.
    """
    async with SessionLocal() as session:
        result = await session.execute(
            select(GenAIMetadata).order_by(GenAIMetadata.timestamp.desc()).limit(50)
        )
        rows = result.scalars().all()
        return [r.to_dict() for r in rows]


@router.get("/logs/api")
async def api_logs():
    """
    Return a summary of the last 100 API log entries in a formatted text list.

    Returns:
        List[str]: A formatted string list summarizing API log activity.
    """
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
    """
    Return basic system metrics including uptime, CPU usage, memory usage, 
    and aggregated stats over the last 24 hours of GenAI metadata.

    Returns:
        dict: Aggregated statistics and hardware metrics.
    """
    async with SessionLocal() as session:
        since = datetime.now() - timedelta(hours=24)
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
    """
    Retrieve deduplicated recent queries (within 24 hours) from the GenAI metadata table.

    Returns:
        List[dict]: A list of recent unique queries.
    """
    async with SessionLocal() as session:
        since = datetime.now() - timedelta(hours=24)
        result = await session.execute(
            select(GenAIMetadata)
            .where(GenAIMetadata.timestamp > since)
            .order_by(GenAIMetadata.timestamp.desc())
        )
        rows = result.scalars().all()

        seen = set()
        unique = []
        for r in rows:
            key = (r.user_id, r.tokens_input, r.tokens_output)
            if key not in seen:
                seen.add(key)
                unique.append(r)

        return [r.to_dict() for r in unique]


@router.get("/alerts")
async def system_alerts():
    """
    Run and return results from the system health check.

    Returns:
        dict: Health check report with warnings or alerts.
    """
    return await run_health_check()


@router.get("/chroma/index")
def get_chroma_index():
    """
    Return stats about the ChromaDB index including vector count and chunk distribution.

    Returns:
        dict: Statistics on stored vectors and their chunk mappings.
    """
    client = PersistentClient(path="data/chroma")
    collection = client.get_or_create_collection(name="financial_docs")

    all_data = collection.get(include=["metadatas"])

    chunk_counts = Counter()
    for meta in all_data["metadatas"]:
        if meta is None:
            continue
        chunk_id = meta.get("chunk") or meta.get("chunk_id") or meta.get("document_id") or "unknown"
        chunk_counts[chunk_id] += 1

    return {
        "collection": "financial_docs",
        "vector_count": len(all_data["metadatas"]),
        "chunk_stats": [{"chunk": k, "vectors": v} for k, v in sorted(chunk_counts.items())]
    }
