import chromadb
from chromadb.config import Settings
from app.embeddings import get_embedding

client = chromadb.Client(Settings(chroma_db_impl="duckdb+parquet", persist_directory="data/chroma"))
collection = client.get_or_create_collection(name="financial_docs")

def add_to_vectorstore(chunks):
    for i, chunk in enumerate(chunks):
        collection.add(
            documents=[chunk],
            ids=[f"chunk_{i}"],
            embeddings=[get_embedding(chunk)]
        )

def query_vectorstore(query: str):
    embedding = get_embedding(query)
    results = collection.query(query_embeddings=[embedding], n_results=3)
    return results['documents'][0]
