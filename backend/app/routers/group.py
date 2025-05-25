from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.future import select
from uuid import uuid4
from datetime import datetime

from app.services.auth_service import get_current_user
from app.db import SessionLocal
from app.models.group import Group

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
