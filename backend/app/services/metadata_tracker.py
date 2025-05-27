import time
from datetime import datetime

# Temporary in-memory log store (replace with DB or Redis in production)
upload_logs = []
query_logs = []


def log_upload(filename: str, user: str, size_kb: float):
    """
    Log metadata about a file upload event.

    Args:
        filename (str): Name of the uploaded file.
        user (str): User who uploaded the file.
        size_kb (float): File size in kilobytes.

    Returns:
        None
    """
    upload_logs.append({
        "filename": filename,
        "user": user,
        "size_kb": size_kb,
        "timestamp": datetime.now().isoformat()
    })


def log_query(user_id: str, query: str, latency: float, top_k: int):
    """
    Log metadata about a query event.

    Args:
        user_id (str): ID of the user who made the query.
        query (str): The input query string.
        latency (float): Latency of the query in seconds.
        top_k (int): Number of top documents retrieved.

    Returns:
        None
    """
    query_logs.append({
        "user_id": user_id,
        "query": query,
        "latency_ms": round(latency * 1000, 2),
        "top_k": top_k,
        "timestamp": datetime.now().isoformat()
    })


def get_recent_logs():
    """
    Retrieve the 10 most recent uploads and queries.

    Returns:
        dict: Dictionary with two lists — recent uploads and recent queries.
    """
    return {
        "uploads": upload_logs[-10:],
        "queries": query_logs[-10:]
    }
