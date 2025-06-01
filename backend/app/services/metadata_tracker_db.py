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
    """
    Log query metadata to the GenAIMetadata table.

    This is used for observability, analytics, and monitoring system performance over time.

    Args:
        db (AsyncSession): Active database session.
        query_id (int | None): Foreign key reference to the main query (from AuditLog).
        user_id (str): ID of the user who submitted the query.
        model_name (str): Name of the LLM used (e.g., "gpt-4").
        tokens_input (int): Number of input tokens sent to the model.
        tokens_output (int): Number of output tokens received from the model.
        latency_ms (float): Time taken to complete the request (in milliseconds).
        retrieved_docs_count (int): Number of documents retrieved from the vector store.
        source_type (str, optional): Type of source used (e.g., "vector", "cache"). Default is "vector".
        cached (bool, optional): Whether the response was served from cache. Default is False.

    Returns:
        None
    """
    entry = GenAIMetadata(
        query_id=query_id,
        user_id=user_id,
        model_name=model_name,
        tokens_input=tokens_input,
        tokens_output=tokens_output,
        latency_ms=int(latency_ms),
        retrieved_docs_count=retrieved_docs_count,
        source_type=source_type,
        cached=True if cached else False
    )
    db.add(entry)
    await db.commit()
