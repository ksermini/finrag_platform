# rag_group_service.py
from app.rag_service import process_query
from app.vector_store import query_vectorstore_with_group
from app.services.group_helpers import get_user_primary_group, get_group_agent_role

async def process_query_with_group_context(query: str, user_id: str):
    group = await get_user_primary_group(user_id)
    role = await get_group_agent_role(group.id)

    # Restrict vector context to group
    docs = query_vectorstore_with_group(query, group_id=group.id)
    context = "\n\n".join(docs)

    # Wrap call to original process_query
    return await process_query(query=query, user_id=user_id, role=role, context_override=context)
