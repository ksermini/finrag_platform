import asyncio
from app.database.database import engine

# Import all models to register with SQLAlchemy Base metadata
from app.models import user
from app.models import audit
from app.models import metadata
from app.models import feedback

async def init_models():
    print("⏳ Initializing all database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(user.Base.metadata.create_all)
    print("✅ Database initialized.")

if __name__ == "__main__":
    asyncio.run(init_models())
