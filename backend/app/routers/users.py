from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Optional

from app.db import get_db
from app.models.user import User

router = APIRouter()

# ✅ Response model (excludes password)
class UserRead(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        orm_mode = True


# ✅ Input model for creation
class UserCreate(BaseModel):
    email: str
    role: str
    hashed_password: str  # for now, plain hash; later use hashing


# ✅ Input model for updates (partial)
class UserUpdate(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    hashed_password: Optional[str] = None


@router.get("/users", response_model=List[UserRead])
async def get_users(db: AsyncSession = Depends(get_db)):
    """
    Fetch all users from the database.
    """
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users


@router.post("/users", response_model=UserRead)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new user.
    """
    new_user = User(**user.dict())
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.put("/users/{user_id}", response_model=UserRead)
async def update_user(user_id: int, user: UserUpdate, db: AsyncSession = Depends(get_db)):
    """
    Update a user by ID.
    """
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)

    await db.commit()
    await db.refresh(db_user)
    return db_user
