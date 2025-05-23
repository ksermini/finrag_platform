from typing import Generic, TypeVar, Type, Optional, List, Any, TYPE_CHECKING
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

if TYPE_CHECKING:
    from app.core.database import Base

ModelType = TypeVar("ModelType")

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model
    
    async def get(self, session: AsyncSession, id: Any) -> Optional[ModelType]:
        """Get a single record by ID."""
        result = await session.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_all(self, session: AsyncSession) -> List[ModelType]:
        """Get all records."""
        result = await session.execute(select(self.model))
        return result.scalars().all()
    
    async def create(self, session: AsyncSession, obj_in: dict) -> ModelType:
        """Create a new record."""
        db_obj = self.model(**obj_in)
        session.add(db_obj)
        await session.commit()
        await session.refresh(db_obj)
        return db_obj
    
    async def update(self, session: AsyncSession, id: Any, obj_in: dict) -> Optional[ModelType]:
        """Update a record."""
        await session.execute(
            update(self.model)
            .where(self.model.id == id)
            .values(**obj_in)
        )
        await session.commit()
        return await self.get(session, id)
    
    async def delete(self, session: AsyncSession, id: Any) -> bool:
        """Delete a record."""
        result = await session.execute(
            delete(self.model).where(self.model.id == id)
        )
        await session.commit()
        return result.rowcount > 0
    
    async def exists(self, session: AsyncSession, id: Any) -> bool:
        """Check if a record exists."""
        result = await session.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none() is not None 