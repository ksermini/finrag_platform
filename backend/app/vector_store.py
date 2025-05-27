"""
Vector Store Integration (ChromaDB)

Summary:

| Function                     | Description                                                              |
|-----------------------------|--------------------------------------------------------------------------|
| `add_to_vectorstore`        | Embeds and stores each text chunk with metadata (file, user, group)      |
| `query_vectorstore`         | Embeds a user query and retrieves the most similar chunks globally       |
| `query_vectorstore_with_group` | Same as above but filtered by group_id for scoped context                |
| `PersistentClient`          | Ensures all vectors are persisted on disk (data survives restarts)       |
"""

from chromadb import PersistentClient
from app.embeddings import get_embedding

# Use on-disk persistent storage
client = PersistentClient(path="data/chroma")
collection = client.get_or_create_collection(name="financial_docs")


def add_to_vectorstore(chunks: list[str], filename: str = "file", user_id: str = None, group_id: str = None):
    """
    Store a list of text chunks in ChromaDB as embeddings.

    Args:
        chunks (list[str]): The chunks of text to embed and store.
        filename (str): The name of the source file (used for ID prefix).
        user_id (str, optional): ID of the user uploading the document.
        group_id (str, optional): ID of the group associated with the document.

    Returns:
        None
    """
    documents = []
    ids = []
    embeddings = []
    metadatas = []

    for i, chunk in enumerate(chunks):
        documents.append(chunk)
        ids.append(f"{filename}_chunk_{i}")
        embeddings.append(get_embedding(chunk))
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
    Query the vector store globally using an embedded search.

    Args:
        query (str): The user input to embed and match.
        n_results (int): Number of top-matching results to return.

    Returns:
        list[str]: The top-matching document chunks.
    """
    embedding = get_embedding(query)
    results = collection.query(query_embeddings=[embedding], n_results=n_results)
    return results['documents'][0] if results and results.get('documents') else []


def query_vectorstore_with_group(query: str, group_id: str, n_results: int = 5) -> list[str]:
    """
    Query the vector store with a group filter to scope results.

    Args:
        query (str): The user input to embed and match.
        group_id (str): The group ID used to filter stored chunks.
        n_results (int): Number of top-matching results to return.

    Returns:
        list[str]: The top-matching group-scoped document chunks.
    """
    embedding = get_embedding(query)
    where_filter = {"group_id": str(group_id)}

    results = collection.query(
        query_embeddings=[embedding],
        n_results=n_results,
        where=where_filter
    )

    return results['documents'][0] if results and results.get('documents') else []
