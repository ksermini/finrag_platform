from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.base_service import BaseService
from app.models.user import User
from passlib.context import CryptContext
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService(BaseService[User]):
    def get_model(self) -> type[User]:
        return User
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)
    
    async def get_by_email(self, session: AsyncSession, email: str) -> Optional[User]:
        result = await session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none() 