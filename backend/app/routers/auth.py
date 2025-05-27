from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.future import select
from app.models.user import User
from app.db import SessionLocal
from app.services.auth_service import hash_password, verify_password, create_access_token
from pydantic import BaseModel
from app.schemas.auth import RegisterRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])


class AuthRequest(BaseModel):
    """
    Schema for login authentication request.
    
    Attributes:
        email (str): The user's email address.
        password (str): The user's plain-text password.
    """
    email: str
    password: str


@router.post("/register")
async def register(auth: RegisterRequest):
    """
    Register a new user account.

    Args:
        auth (RegisterRequest): User registration payload including email, name, and password.

    Raises:
        HTTPException: If the email is already registered.

    Returns:
        dict: Confirmation message.
    """
    async with SessionLocal() as session:
        result = await session.execute(select(User).where(User.email == auth.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already registered.")

        user = User(
            email=auth.email,
            hashed_password=hash_password(auth.password),
            first_name=auth.first_name,
            last_name=auth.last_name,
            role="user",
            is_active=True,
            is_admin=False,
            account_status="active"
        )
        session.add(user)
        await session.commit()
        return {"message": "User registered."}


@router.post("/login")
async def login(auth: AuthRequest):
    """
    Authenticate a user and return an access token.

    Args:
        auth (AuthRequest): Login credentials including email and password.

    Raises:
        HTTPException: If credentials are invalid.

    Returns:
        dict: JWT access token and user role.
    """
    async with SessionLocal() as session:
        result = await session.execute(select(User).where(User.email == auth.email))
        user = result.scalar_one_or_none()
        if not user or not verify_password(auth.password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        token = create_access_token({"sub": user.email, "role": user.role})
        return {"access_token": token, "role": user.role}
