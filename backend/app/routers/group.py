from fastapi import APIRouter, Body, HTTPException, Depends
from sqlalchemy.future import select
from uuid import uuid4
from datetime import datetime
from uuid import UUID
from app.services.auth_service import get_current_user
from app.db import SessionLocal, get_db
from app.db import SessionLocal
from app.models.group import Group, UserGroup
from sqlalchemy.ext.asyncio import AsyncSession
router = APIRouter(prefix="/groups", tags=["Groups"])


@router.post("/")
async def create_group(
    name: str,
    description: str = "",
    default_agent_role: str = "domain expert"
):
    async with SessionLocal() as session:
        result = await session.execute(select(Group).where(Group.name == name))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail="Group already exists")

        group = Group(
            name=name,
            description=description,
            default_agent_role=default_agent_role,
            created_at=datetime.utcnow()
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
    # Check if mapping already exists
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
        added_at=datetime.utcnow()
    )
    db.add(user_group)
    await db.commit()
    return {"message": "User added to group"}


@router.post("/assign")
async def add_user_to_group(
    user_id: UUID,
    group_id: UUID,
    role: str = "member"
):
    if role not in {"member", "viewer", "owner"}:
        raise HTTPException(status_code=400, detail="Invalid role. Choose member, viewer, or owner.")

    async with SessionLocal() as session:
        # Check for duplicate
        existing = await session.execute(
            select(UserGroup).where(
                UserGroup.user_id == user_id,
                UserGroup.group_id == group_id
            )
        )
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="User already in group.")

        # Create relationship
        user_group = UserGroup(
            user_id=user_id,
            group_id=group_id,
            role=role,
            added_at=datetime.utcnow()
        )

        session.add(user_group)
        await session.commit()
        await session.refresh(user_group)

        return {
            "message": f"User {user_id} assigned to group {group_id} as {role}",
            "user_id": str(user_id),
            "group_id": str(group_id),
            "role": role,
            "added_at": user_group.added_at.isoformat()
            }