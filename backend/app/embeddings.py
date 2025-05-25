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
