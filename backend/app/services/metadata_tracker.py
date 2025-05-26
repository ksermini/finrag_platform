import time
from datetime import datetime

# This could be replaced with DB or Redis later
upload_logs = []
query_logs = []

def log_upload(filename: str, user: str, size_kb: float):
    upload_logs.append({
        "filename": filename,
        "user": user,
        "size_kb": size_kb,
        "timestamp": datetime.now().isoformat()
    })

def log_query(user_id: str, query: str, latency: float, top_k: int):
    query_logs.append({
        "user_id": user_id,
        "query": query,
        "latency_ms": round(latency * 1000, 2),
        "top_k": top_k,
        "timestamp": datetime.now().isoformat()
    })

def get_recent_logs():
    return {
        "uploads": upload_logs[-10:],
        "queries": query_logs[-10:]
    }
