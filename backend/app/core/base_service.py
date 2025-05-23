from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Type, TYPE_CHECKING
from sqlalchemy.ext.asyncio import AsyncSession

if TYPE_CHECKING:
    from app.core.database import Base

ModelType = TypeVar("ModelType")

class BaseService(Generic[ModelType], ABC):
    def __init__(self, session_factory: AsyncSession):
        self.session_factory = session_factory
        self.model: Type[ModelType] = self.get_model()
    
    @abstractmethod
    def get_model(self) -> Type[ModelType]:
        """Return the model class for this service."""
        pass
    
    async def get_session(self) -> AsyncSession:
        """Get a database session."""
        return self.session_factory
    
    async def commit(self, session: AsyncSession) -> None:
        """Commit the session."""
        await session.commit()
    
    async def rollback(self, session: AsyncSession) -> None:
        """Rollback the session."""
        await session.rollback()
    
    async def close(self, session: AsyncSession) -> None:
        """Close the session."""
        await session.close() 