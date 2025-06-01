import os
from fastapi import APIRouter, HTTPException, Depends, Request, Response
from fastapi.responses import JSONResponse
from sqlalchemy.future import select
from jose import jwt, JWTError
from datetime import timedelta, datetime

from app.models.user import User
from app.db import SessionLocal
from app.services.auth_service import (
    decode_token,
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)
from pydantic import BaseModel
from app.schemas.auth import RegisterRequest
from app.config import settings
from dotenv import load_dotenv
load_dotenv()
env = os.getenv("ENV")
router = APIRouter(prefix="/auth", tags=["Authentication"])


class AuthRequest(BaseModel):
    """
    Schema for login authentication request.
    """
    email: str
    password: str


@router.post("/register")
async def register(auth: RegisterRequest):
    """
    Register a new user account.
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
            account_status="active",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(user)
        await session.commit()
        return {"message": "User registered successfully."}


@router.post("/login")
async def login(auth: AuthRequest):
    """
    Authenticate a user and return access and refresh tokens in cookies and body.
    """
    async with SessionLocal() as session:
        result = await session.execute(select(User).where(User.email == auth.email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(auth.password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")

        token_data = {
            "sub": user.email,
            "user_id": user.id,
            "role": user.role,
            "type": "access"
        }

        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token({
            **token_data,
            "type": "refresh"
        })

        response = JSONResponse(content={
            "access_token": access_token,
            "role": user.role,
            "user_id": user.id
        })

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=(env != "development"),
            samesite="strict",
            max_age=60 * 15  # 15 minutes
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=(env != "development"),
            samesite="strict",
            max_age=60 * 60 * 24 * 7  # 7 days
        )
        return response


@router.post("/auth/refresh")
async def refresh_access_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Generate new access token
    access_token = create_access_token(
        data={
            "sub": payload["sub"],
            "user_id": payload["user_id"],
            "role": payload["role"]
        },
        expires_delta=timedelta(minutes=15)  # must be > 0 and in the future
    )

    # Set new access token cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=15 * 60,
        path="/"
    )

    return {"message": "Access token refreshed"}


