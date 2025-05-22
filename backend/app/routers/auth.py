from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.future import select
from app.models.user import User
from app.db import SessionLocal
from app.services.auth_service import hash_password, verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter(prefix="/auth")

class AuthRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(auth: AuthRequest):
    async with SessionLocal() as session:
        user = User(email=auth.email, hashed_password=hash_password(auth.password))
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
