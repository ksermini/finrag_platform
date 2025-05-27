from sqlalchemy.future import select
from datetime import datetime, timedelta
from app.db import SessionLocal
from app.models.metadata import GenAIMetadata
from app.models.feedback import Feedback

async def run_health_check():
    """
    Run a real-time health check on RAG system performance and feedback quality.

    This function checks for:
    - Lack of RAG activity in the past 30 minutes
    - High-latency queries (> 3000 ms)
    - Queries with zero retrieved documents
    - High ratio of negative user feedback

    Returns:
        List[str]: A list of human-readable system alerts. Empty if system is healthy.
    """
    async with SessionLocal() as session:
        since = datetime.now() - timedelta(minutes=30)

        result = await session.execute(select(GenAIMetadata).where(GenAIMetadata.timestamp > since))
        rows = result.scalars().all()

        alerts = []
        if not rows:
            alerts.append("No RAG activity in the last 30 minutes.")
            return alerts

        high_latency = [r for r in rows if r.latency_ms > 3000]
        if high_latency:
            alerts.append(f"{len(high_latency)} queries > 3s latency.")

        zero_hits = [r for r in rows if r.retrieved_docs_count == 0]
        if zero_hits:
            alerts.append(f"{len(zero_hits)} queries had 0 documents retrieved.")

        fb_result = await session.execute(select(Feedback).where(Feedback.timestamp > since))
        fbs = fb_result.scalars().all()
        neg = sum(1 for f in fbs if f.rating == "negative")

        if fbs and (neg / len(fbs)) > 0.3:
            alerts.append("High negative feedback rate.")

        return alerts
