import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv


load_dotenv()  

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)
SessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

# Correctly formatted async generator for FastAPI
async def get_db():
    async with SessionLocal() as session:
        yield session
# main.py or wherever you call create_all
from app.db import Base, engine
from app.models import *  # This forces all model classes to be registered
Base.metadata.create_all(bind=engine) 

async def init_models():
    print(" Initializing all database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all, checkfirst=True)
    print(" Database initialized.")

if __name__ == "__main__":
    asyncio.run(init_models())
