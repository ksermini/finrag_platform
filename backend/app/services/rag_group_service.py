from sqlalchemy.future import select
from app.db import SessionLocal
from app.models.group_document import RAGGroupConfig
from uuid import UUID

async def get_rag_config_for_group(group_id: UUID) -> RAGGroupConfig | None:
    """
    Fetch the RAG configuration for a specific group.

    Args:
        group_id (UUID): The unique identifier of the group.

    Returns:
        RAGGroupConfig | None: The group's RAG configuration object, or None if not found.
    """
    async with SessionLocal() as session:
        result = await session.execute(
            select(RAGGroupConfig).where(RAGGroupConfig.group_id == group_id)
        )
        return result.scalar_one_or_none()

