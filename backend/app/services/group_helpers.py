from sqlalchemy.future import select
from app.db import SessionLocal
from app.models.group import Group, UserGroup
from uuid import UUID

from chromadb import PersistentClient
from app.embeddings import get_embedding

# Initialize ChromaDB collection
client = PersistentClient(path="data/chroma")
collection = client.get_or_create_collection(name="financial_docs")


def get_user_primary_group(user_id: UUID) -> Group:
    """
    Retrieve the first group assigned to a user.

    This can later be extended to return the user's active or preferred group.

    Args:
        user_id (UUID): ID of the user.

    Raises:
        Exception: If the user is not assigned to any group.

    Returns:
        Group: The first group the user is assigned to.
    """
    with SessionLocal() as session:
        result = session.execute(
            select(Group).join(UserGroup).where(UserGroup.user_id == user_id)
        )
        group = result.scalars().first()
        if not group:
            raise Exception("User is not part of any group.")
        return group


async def get_group_agent_role(group_id: UUID) -> str:
    """
    Get the default agent role associated with a group.

    Args:
        group_id (UUID): ID of the group.

    Raises:
        Exception: If the group is not found.

    Returns:
        str: The default agent role, or "domain expert" if not set.
    """
    async with SessionLocal() as session:
        result = await session.execute(select(Group).where(Group.id == group_id))
        group = result.scalar_one_or_none()
        if not group:
            raise Exception("Group not found.")
        return group.default_agent_role or "domain expert"


def query_vectorstore_with_group(query: str, group_id: UUID, n_results: int = 3):
    """
    Query the vector store using a group-filtered search.

    This ensures documents returned belong to the specified group.

    Args:
        query (str): Natural language query string.
        group_id (UUID): ID of the group for context filtering.
        n_results (int): Number of documents to retrieve.

    Returns:
        List[str]: A list of retrieved document chunks.
    """
    embedding = get_embedding(query)
    results = collection.query(
        query_embeddings=[embedding],
        n_results=n_results,
        where={"group_id": str(group_id)}
    )
    return results["documents"][0]
