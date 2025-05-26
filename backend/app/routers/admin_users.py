from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from fastapi import status
from app.db import get_db
from app.models.user import User
from app.schemas.users import UserRead, UserUpdate, UserCreate
from app.services.auth_service import hash_password


router = APIRouter(prefix="/admin/users", tags=["Admin Users"])

@router.get("/", response_model=List[UserRead])
async def get_all_users(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User))
    return result.scalars().all()

@router.post("/", response_model=UserRead)
async def create_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(select(User).where(User.email == user.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists."
        )
    hashed_pw = hash_password(user.password)  # 🔐 Hash the incoming plain password
    new_user = User(
        **user.dict(exclude={"password"}),  # don't pass 'password' directly
        hashed_password=hashed_pw           # explicitly set the hashed password
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: int,
    user: UserUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)

    await db.commit()
    await db.refresh(db_user)
    return db_user
