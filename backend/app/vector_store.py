"""
Summary:

| Section              | What It Does                                                               |
| -------------------- | -------------------------------------------------------------------------- |
| `add_to_vectorstore` | Embeds each chunk of text and stores it with an ID in Chroma               |
| `query_vectorstore`  | Embeds the user’s query and returns the 3 most similar text chunks         |
| `PersistentClient`   | Ensures data is saved to disk (you can shut down and still retain vectors) |

"""

from app.embeddings import get_embedding
# persistin client uses persistent on-disk storage, saves data even after it shuts down
from chromadb import PersistentClient

# Chroma will use the path to write and read the persisted data
# Mini vector database on disk
client = PersistentClient(path="data/chroma")
# Retrieves or creates a vector collection named "financial_docs"
# Collection (table) - holds vectors, doc, and metadata
collection = client.get_or_create_collection(name="financial_docs")

def add_to_vectorstore(chunks):
    """
        Take a list of text (chunks) and store them in the chrom vector store
    """
    # loop through each chunk of text, assigning a unique index i
    for i, chunk in enumerate(chunks):
        collection.add(
            # Raw test
            documents=[chunk],
            # unique id per chunk
            ids=[f"chunk_{i}"],
            # Embeds the chunk into a high dim using the embedding func
            embeddings=[get_embedding(chunk)]
        )

def query_vectorstore(query: str):
    """
        Takes the users query and return the most relevant documents
    """
    # Converts the query into an embedding vector using the same model as the chunks
    embedding = get_embedding(query)
    # Searches for the 3 most similar vectors in the collection using vector similarity (cosine or dot product)
    # query_embeddings must be a list of vectors
    results = collection.query(query_embeddings=[embedding], n_results=3)
    # returns the first list of top_matching docs
    return results['documents'][0]


def query_vectorstore_with_group(query: str, group_id: str):
    return collection.query(
        query_embeddings=[get_embedding(query)],
        n_results=5,
        where={"group_id": group_id}
    )["documents"][0]

# EXAMPLE:
# 3 most relevant matching docs
# {
#   'documents': [["doc1", "doc2", "doc3"]],
#   'ids': [["chunk_0", "chunk_5", "chunk_8"]],
#   'distances': [[0.14, 0.22, 0.25]]
# }
