from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.future import select
from app.models.user import User
from app.db import SessionLocal
from app.services.auth_service import hash_password, verify_password, create_access_token
from pydantic import BaseModel
from app.schemas.auth import RegisterRequest


router = APIRouter(prefix="/auth")

class AuthRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(auth: RegisterRequest):
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
    async with SessionLocal() as session:
        result = await session.execute(select(User).where(User.email == auth.email))
        user = result.scalar_one_or_none()
        if not user or not verify_password(auth.password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        token = create_access_token({"sub": user.email, "role": user.role})
        return {"access_token": token, "role": user.role}
