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
    """
    Retrieve the currently authenticated user's profile.

    Args:
        db (AsyncSession): The database session.
        current_user (User): The currently authenticated user.

    Returns:
        UserRead: The user’s profile information.
    """
    return current_user


@router.put("/", response_model=UserRead)
async def update_my_profile(
    user: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update the authenticated user's profile fields.

    Args:
        user (UserUpdate): Fields to update.
        db (AsyncSession): The database session.
        current_user (User): The authenticated user.

    Returns:
        UserRead: The updated user profile.
    """
    for key, value in user.dict(exclude_unset=True).items():
        setattr(current_user, key, value)

    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.get("/email/{email}", response_model=UserRead)
async def get_user_by_email(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a user’s profile by their email address.

    Args:
        email (str): The email to search for.
        db (AsyncSession): The database session.

    Raises:
        HTTPException: If the user is not found.

    Returns:
        UserRead: The user profile matching the email.
    """
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/users/{user_id}/group")
async def get_user_group_by_id(user_id: int):
    """
    Get the primary group a user belongs to, using their user ID.

    Args:
        user_id (int): The user’s ID.

    Raises:
        HTTPException: If the user is not assigned to any group.

    Returns:
        dict: Group ID, name, and default agent role.
    """
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
