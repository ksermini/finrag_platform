from fastapi import APIRouter, Body, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.future import select
from uuid import uuid4, UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.auth_service import get_current_user
from app.db import SessionLocal, get_db
from app.models.group import Group, UserGroup
from app.models.user import User
from app.schemas.groups import UserGroupAssign

router = APIRouter(prefix="/groups", tags=["Groups"])


@router.post("/")
async def create_group(
    name: str,
    description: str = "",
    default_agent_role: str = "domain expert"
):
    """
    Create a new user group.

    Args:
        name (str): The name of the group.
        description (str, optional): A description of the group.
        default_agent_role (str, optional): Default role used in prompt engineering.

    Raises:
        HTTPException: If a group with the same name already exists.

    Returns:
        dict: Details of the created group.
    """
    async with SessionLocal() as session:
        result = await session.execute(select(Group).where(Group.name == name))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail="Group already exists")

        group = Group(
            name=name,
            description=description,
            default_agent_role=default_agent_role,
            created_at=datetime.now()
        )

        session.add(group)
        await session.commit()
        await session.refresh(group)

        return {
            "id": str(group.id),
            "name": group.name,
            "default_agent_role": group.default_agent_role,
            "created_at": group.created_at.isoformat()
        }


@router.get("/")
async def list_all_groups():
    """
    List all existing user groups.

    Returns:
        List[dict]: Metadata for all user groups.
    """
    async with SessionLocal() as session:
        result = await session.execute(select(Group))
        groups = result.scalars().all()

    return [
        {
            "id": str(group.id),
            "name": group.name,
            "description": group.description,
            "default_agent_role": group.default_agent_role,
            "created_at": group.created_at.isoformat(),
        }
        for group in groups
    ]


@router.post("/{group_id}/add-user")
async def add_user_to_group(
    group_id: UUID,
    user_id: UUID = Body(...),
    role: str = Body(default="member"),
    db: AsyncSession = Depends(get_db)
):
    """
    Add a user to a group by IDs and assign a role.

    Args:
        group_id (UUID): The ID of the group.
        user_id (UUID): The ID of the user to add.
        role (str, optional): The user's role in the group.

    Raises:
        HTTPException: If user is already in the group.

    Returns:
        dict: Success message.
    """
    result = await db.execute(
        select(UserGroup)
        .where(UserGroup.user_id == user_id)
        .where(UserGroup.group_id == group_id)
    )
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="User already in group")

    user_group = UserGroup(
        user_id=user_id,
        group_id=group_id,
        role=role,
        added_at=datetime.now
    )
    db.add(user_group)
    await db.commit()
    return {"message": "User added to group"}


@router.get("/{group_id}/users")
async def get_group_users(group_id: UUID):
    """
    Retrieve a list of users assigned to a specific group.

    Args:
        group_id (UUID): The ID of the group.

    Returns:
        List[dict]: Users with their email, role, and join timestamp.
    """
    async with SessionLocal() as session:
        result = await session.execute(
            select(UserGroup, User).join(User, UserGroup.user_id == User.id).where(UserGroup.group_id == group_id)
        )
        rows = result.all()

        return [
            {
                "id": str(user.id),
                "email": user.email,
                "role": user_group.role,
                "added_at": user_group.added_at.isoformat()
            }
            for user_group, user in rows
        ]


@router.post("/assign")
async def add_user_to_group(data: UserGroupAssign):
    """
    Assign a user to a group using a structured payload.

    Args:
        data (UserGroupAssign): Includes user_id, group_id, and role.

    Raises:
        HTTPException: If the user is already in the group or role is invalid.

    Returns:
        dict: Confirmation message.
    """
    if data.role not in {"member", "viewer", "owner"}:
        raise HTTPException(status_code=400, detail="Invalid role.")

    async with SessionLocal() as session:
        existing = await session.execute(
            select(UserGroup).where(
                UserGroup.user_id == data.user_id,
                UserGroup.group_id == str(data.group_id)
            )
        )
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="User already in group.")

        user_group = UserGroup(
            user_id=data.user_id,
            group_id=str(data.group_id),
            role=data.role,
            added_at=datetime.now
        )

        session.add(user_group)
        await session.commit()
        return {
            "message": f"User {data.user_id} added to group {data.group_id} as {data.role}"
        }
