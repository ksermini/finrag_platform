# rag_group_service.py
from app.services.rag_service import process_query
from app.vector_store import query_vectorstore_with_group
from app.services.group_helpers import get_user_primary_group, get_group_agent_role
from sqlalchemy.future import select
from app.db import SessionLocal
from app.models.group_document import RAGGroupConfig
from uuid import UUID

async def get_rag_config_for_group(group_id: UUID) -> RAGGroupConfig | None:
    async with SessionLocal() as session:
        result = await session.execute(
            select(RAGGroupConfig).where(RAGGroupConfig.group_id == group_id)
        )
        return result.scalar_one_or_none()

async def process_query_with_group_context(query: str, user_id: str):
    group = await get_user_primary_group(user_id)
    role = await get_group_agent_role(group.id)

    # Restrict vector context to group
    docs = query_vectorstore_with_group(query, group_id=group.id)
    context = "\n\n".join(docs)

    # Wrap call to original process_query
    return await process_query(query=query, user_id=user_id, role=role, context_override=context)
