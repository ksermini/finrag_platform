from sqlalchemy.ext.asyncio import AsyncSession
from app.models.metadata import GenAIMetadata

async def log_query_db(
    db: AsyncSession,
    *,
    query_id: int | None,
    user_id: str,
    model_name: str,
    tokens_input: int,
    tokens_output: int,
    latency_ms: float,
    retrieved_docs_count: int,
    source_type: str = "vector",
    cached: bool = False
):
    entry = GenAIMetadata(
        query_id=query_id,
        user_id=user_id,
        model_name=model_name,
        tokens_input=tokens_input,
        tokens_output=tokens_output,
        latency_ms=int(latency_ms),
        retrieved_docs_count=retrieved_docs_count,
        source_type=source_type,
        cached="true" if cached else "false"
    )
    db.add(entry)
    await db.commit()
