from dependency_injector import containers, providers
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.core.database import Base
from app.services.vector_store import VectorStoreService
from app.services.auth import AuthService
from app.services.user import UserService

class Container(containers.DeclarativeContainer):
    # Configuration
    config = providers.Configuration()
    
    # Database
    engine = providers.Singleton(
        create_async_engine,
        settings.DATABASE_URL,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        echo=False
    )
    
    session_factory = providers.Singleton(
        sessionmaker,
        engine,
        expire_on_commit=False,
        class_=AsyncSession
    )
    
    # Services
    vector_store = providers.Singleton(
        VectorStoreService,
        store_path=settings.VECTOR_STORE_PATH
    )
    
    auth_service = providers.Singleton(
        AuthService,
        secret_key=settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
        access_token_expire_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    user_service = providers.Singleton(
        UserService,
        session_factory=session_factory
    )
    
    # Database session provider
    db_session = providers.Resource(
        session_factory
    )

container = Container() 