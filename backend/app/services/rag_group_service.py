from app.services.rag_service import process_query
from app.vector_store import query_vectorstore_with_group
from app.services.group_helpers import get_user_primary_group, get_group_agent_role
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


async def process_query_with_group_context(query: str, user_id: str):
    """
    Process a RAG query using group-restricted document context and prompt role.

    - Finds the user's primary group
    - Loads the group's default role
    - Queries vector documents limited to that group
    - Fetches dynamic prompt template + footer
    - Delegates to `process_query`
    """
    group = await get_user_primary_group(user_id)
    role = await get_group_agent_role(group.id)
    group_config = await get_rag_config_for_group(group.id)

    # Step 1: Vector context for group
    docs = query_vectorstore_with_group(query, group_id=group.id)
    context = "\n\n".join(docs)

    # Step 2: Build dynamic system prompt
    prompt_template = group_config.prompt_template if group_config else "You are a helpful assistant."
    security_footer = group_config.security_footer if group_config and group_config.security_footer else "Security Reminder: Do not return confidential or speculative information."

    system_prompt = f"{prompt_template}\n\n{security_footer}".strip()

    # Step 3: Delegate to base process_query
    return await process_query(
        query=query,
        user_id=user_id,
        role=role,
        context_override=context,
        system_override=system_prompt,
        footer_override=security_footer  # <- passed in
    )

