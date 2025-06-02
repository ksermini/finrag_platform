# from langchain.vectorstores import Chroma
# vectordb = Chroma.from_documents(data, embeddings, ids)

# from chromaviz import visualize_collection
# visualize_collection(vectordb._collection)
from chromadb import PersistentClient

client = PersistentClient(path="data/chroma")
collection = client.get_or_create_collection(name="financial_docs")

# Retrieve documents, metadata, and embeddings (if needed)
results = collection.get(include=["documents", "metadatas"])

for i, doc in enumerate(results["documents"]):
    print("="*60)
    print(f"Document {i+1}")
    print("Metadata:", results["metadatas"][i])
    print("Preview:", doc[:300], "..." if len(doc) > 300 else "")
