# app/services/group_helpers.py

from sqlalchemy.future import select
from app.db import SessionLocal
from app.models.group import Group, UserGroup
from uuid import UUID

from chromadb import PersistentClient
client = PersistentClient(path="data/chroma")
collection = client.get_or_create_collection(name="financial_docs")
from app.embeddings import get_embedding

def get_user_primary_group(user_id: UUID) -> Group:
    """Return the user's first assigned group (can add active group selection later)."""
    with SessionLocal() as session:
        result = session.execute(
            select(Group).join(UserGroup).where(UserGroup.user_id == user_id)
        )
        print(Group)
        group = result.scalars().first()
        if not group:
            raise Exception("User is not part of any group.")
        return group

async def get_group_agent_role(group_id: UUID) -> str:
    """Return the default agent role for a group."""
    async with SessionLocal() as session:
        result = await session.execute(select(Group).where(Group.id == group_id))
        group = result.scalar_one_or_none()
        if not group:
            raise Exception("Group not found.")
        return group.default_agent_role or "domain expert"
def query_vectorstore_by_group(query: str, group_id: str):
    embedding = get_embedding(query)
    results = collection.query(
        query_embeddings=[embedding],
        n_results=5,
        where={"group_id": group_id}
    )
    return results["documents"][0]
