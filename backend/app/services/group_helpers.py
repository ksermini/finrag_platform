# app/services/group_helpers.py

from sqlalchemy.future import select
from app.db import SessionLocal
from app.models.group import Group, UserGroup
from uuid import UUID

async def get_user_primary_group(user_id: UUID) -> Group:
    """Return the user's first assigned group (can add active group selection later)."""
    async with SessionLocal() as session:
        result = await session.execute(
            select(Group).join(UserGroup).where(UserGroup.user_id == user_id)
        )
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
