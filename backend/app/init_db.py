import asyncio
from database.database import engine
from models import user  # ensure all models are registered

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(user.Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init_models())