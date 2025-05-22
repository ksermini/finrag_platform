# import openai
# import os

# openai.api_key = os.getenv("OPENAI_API_KEY")

# response = openai.ChatCompletion.create(
#     model="gpt-3.5-turbo",
#     messages=[{"role": "user", "content": "What’s the cheapest OpenAI model?"}]
# )

# print(response.choices[0].message.content)
# backend/init_db.py

import asyncio
from app.db import engine
from app.models.base import Base
from app.models import user, audit, metadata, feedback

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init_db())
