import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL")
    SECRET_KEY = os.getenv("OPENAI_API_KEY")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

settings = Settings()


engine = create_async_engine(settings.DATABASE_URL, echo=False)
SessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

# ✅ Correctly formatted async generator for FastAPI
async def get_db():
    async with SessionLocal() as session:
        yield session

from sqlalchemy import Column, Float, String, Boolean, DateTime, ForeignKey, Text, UUID
from datetime import datetime
from sqlalchemy.orm import declarative_base

Base = declarative_base()
import uuid

class GroupDocument(Base):
    __tablename__ = "group_documents"
    __table_args__ = {"extend_existing": True}  # ✅ This line resolves the error

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    file_path = Column(String, nullable=True)
    embedded = Column(Boolean, default=False)
    created_by = Column(String, default="system")
    created_at = Column(DateTime, default=datetime.now)
class RAGGroupConfig(Base):
    __tablename__ = "rag_group_config"

    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), primary_key=True)
    tone = Column(String, default="professional")
    temperature = Column(Float, default=0.7)
    prompt_template = Column(Text, nullable=True)
    enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
"""
Summary:

| Section              | What It Does                                                               |
| -------------------- | -------------------------------------------------------------------------- |
| `add_to_vectorstore` | Embeds each chunk of text and stores it with an ID in Chroma               |
| `query_vectorstore`  | Embeds the user’s query and returns the 3 most similar text chunks         |
| `PersistentClient`   | Ensures data is saved to disk (you can shut down and still retain vectors) |
"""

from chromadb import PersistentClient
# app/embeddings.py
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
EMBEDDING_MODEL = "text-embedding-3-small"

def get_embedding(text: str) -> list[float]:
    return get_embeddings([text])[0]

def get_embeddings(texts: list[str]) -> list[list[float]]:
    """
    Returns a list of embeddings for a list of input texts (batch optimized).
    """
    response = client.embeddings.create(input=texts, model=EMBEDDING_MODEL)
    return [item.embedding for item in response.data]


# Use on-disk storage so vectors persist even after shutdown
client = PersistentClient(path="data/chroma")
collection = client.get_or_create_collection(name="financial_docs")

def add_to_vectorstore(chunks: list[str], filename: str = "file", user_id: str = None, group_id: str = None):
    """
    Store a list of chunks in the Chroma vector store, with optional metadata.
    """
    documents = []
    ids = []
    embeddings = []
    metadatas = []

    for i, chunk in enumerate(chunks):
        documents.append(chunk)
        ids.append(f"{filename}_chunk_{i}")
        embeddings.append(get_embedding(chunk))  # Should be list[float]
        metadatas.append({
            "filename": filename,
            "user_id": str(user_id) if user_id else None,
            "group_id": str(group_id) if group_id else None
        })


    collection.add(
        documents=documents,
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas
    )

def query_vectorstore(query: str, n_results: int = 3) -> list[str]:
    """
    Takes the user’s query, returns top-matching documents using vector similarity.
    """
    embedding = get_embedding(query)
    results = collection.query(query_embeddings=[embedding], n_results=n_results)
    return results['documents'][0] if results and results.get('documents') else []

def query_vectorstore_with_group(query: str, group_id: str, n_results: int = 5) -> list[str]:
    """
    Same as query_vectorstore but filters by group_id in metadata.
    """
    embedding = get_embedding(query)
    results = collection.query(
        query_embeddings=[embedding],
        n_results=n_results,
        where={"group_id": group_id}
    )
    return results['documents'][0] if results and results.get('documents') else []


async def sync_group_documents():
    async with SessionLocal() as session:
        result = await session.execute(
            GroupDocument.__table__.select().where(GroupDocument.embedded == False)
        )
        docs = result.fetchall()

        print(f"🔍 Found {len(docs)} unembedded documents")

        for row in docs:
            doc = dict(row)

            # Break into chunks if needed (for now we treat whole content as one chunk)
            chunks = [doc["content"]]

            add_to_vectorstore(
                chunks,
                filename=doc["title"] or doc["file_path"],
                user_id=doc["created_by"],
                group_id=str(doc["group_id"])  # ensure it's a string
            )

            # Mark as embedded
            await session.execute(
                GroupDocument.__table__.update()
                .where(GroupDocument.id == doc["id"])
                .values(embedded=True)
            )

        await session.commit()
        print("✅ Sync complete!")

if __name__ == "__main__":
    asyncio.run(sync_group_documents())
