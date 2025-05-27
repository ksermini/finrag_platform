_query_cache: dict[tuple[str, str], dict] = {}


def set_cached_answer(user_id: str, query: str, result: dict):
    """
    Store the result of a user query in the in-memory cache.

    Args:
        user_id (str): The ID of the user who submitted the query.
        query (str): The original query string.
        result (dict): The result to cache (typically includes answer, tokens, etc.).

    Returns:
        None
    """
    key = (user_id.strip().lower(), query.strip().lower())
    _query_cache[key] = result
    print(f"[CACHE SET] {key} → {result}")


def get_cached_answer(user_id: str, query: str):
    """
    Retrieve a cached query result for a specific user and query.

    Args:
        user_id (str): The ID of the user.
        query (str): The query string.

    Returns:
        dict or None: Cached result if found, else None.
    """
    key = (user_id.strip().lower(), query.strip().lower())
    hit = key in _query_cache
    print(f"[CACHE GET] {key} — {'HIT' if hit else 'MISS'}")
    return _query_cache.get(key)
