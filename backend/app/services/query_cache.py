_query_cache: dict[tuple[str, str], dict] = {}

def set_cached_answer(user_id: str, query: str, result: dict):
    key = (user_id.strip().lower(), query.strip().lower())
    _query_cache[key] = result
    print(f"[CACHE SET] {key} → {result}")

def get_cached_answer(user_id: str, query: str):
    key = (user_id.strip().lower(), query.strip().lower())
    hit = key in _query_cache
    print(f"[CACHE GET] {key} — {'HIT' if hit else 'MISS'}")
    return _query_cache.get(key)

