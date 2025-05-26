from app.models.group import Group
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import SessionLocal, get_db
from app.models.user import User
from app.schemas.users import UserRead, UserUpdate
from app.dependencies import get_current_user
from app.models.group import UserGroup

router = APIRouter(prefix="/me", tags=["User"])


@router.get("/", response_model=UserRead)
async def get_my_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.put("/", response_model=UserRead)
async def update_my_profile(
    user: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for key, value in user.dict(exclude_unset=True).items():
        setattr(current_user, key, value)

    await db.commit()
    await db.refresh(current_user)
    return current_user


# ✅ NEW: Get user by email (for UI welcome banner)
@router.get("/email/{email}", response_model=UserRead)
async def get_user_by_email(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
@router.get("/users/{user_id}/group")
async def get_user_group_by_id(user_id: int):
    async with SessionLocal() as session:
        result = await session.execute(
            select(Group)
            .join(UserGroup, Group.id == UserGroup.group_id)
            .where(UserGroup.user_id == user_id)
        )
        group = result.scalars().first()
        if not group:
            raise HTTPException(status_code=404, detail="User not in any group")
        return {
            "group_id": str(group.id),
            "group_name": group.name,
            "default_agent_role": group.default_agent_role,
        }


