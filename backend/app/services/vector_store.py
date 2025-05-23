import chromadb
from chromadb.config import Settings
from app.core.base_service import BaseService

class VectorStoreService(BaseService):
    def __init__(self, store_path: str):
        self.client = chromadb.PersistentClient(
            path=store_path,
            settings=Settings(allow_reset=True)
        )
        self.collection = self.client.get_or_create_collection("documents")
    
    def get_model(self):
        return None  # Vector store doesn't use SQLAlchemy models
    
    async def add_documents(self, documents: list[str], metadatas: list[dict], ids: list[str]):
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
    
    async def query(self, query: str, n_results: int = 3):
        return self.collection.query(
            query_texts=[query],
            n_results=n_results
        ) 