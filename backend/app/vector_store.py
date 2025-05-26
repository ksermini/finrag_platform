"""
Summary:

| Section              | What It Does                                                               |
| -------------------- | -------------------------------------------------------------------------- |
| `add_to_vectorstore` | Embeds each chunk of text and stores it with an ID in Chroma               |
| `query_vectorstore`  | Embeds the user’s query and returns the 3 most similar text chunks         |
| `PersistentClient`   | Ensures data is saved to disk (you can shut down and still retain vectors) |
"""

from chromadb import PersistentClient
from app.embeddings import get_embedding

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
    embedding = get_embedding(query)
    where_filter = {"group_id": str(group_id)}

    results = collection.query(
        query_embeddings=[embedding],
        n_results=n_results,
        where=where_filter
    )

    return results['documents'][0] if results and results.get('documents') else []
