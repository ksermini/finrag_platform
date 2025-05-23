from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://localhost:5174"
    ]
    
    # Vector Store
    VECTOR_STORE_PATH: str = "data/vector_store"
    
    # API
    API_PREFIX: str = "/api/v1"
    
    # Frontend
    VITE_API_URL: str = "http://localhost:8000"
    
    # OpenAI
    OPENAI_API_KEY: str
    
    # Development
    SKIP_PREFLIGHT_CHECK: str = "true"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
