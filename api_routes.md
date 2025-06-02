# Retrieval-Augmented Generation (RAG) – API Behavior and System Pathing

This document outlines the full happy path and supporting API infrastructure for executing group-aware Retrieval-Augmented Generation (RAG) queries using FastAPI with async/await patterns.

---

## FastAPI Routing Model

- This backend is built with **FastAPI** using both **sync and async routes**.
- All I/O-heavy operations (LLM, DB, vector search) are asynchronous (`async def`).
- Dependency injection is used to pass `AsyncSession` for DB access and services.
- Caching, logging, and concurrency are fully coroutine-compatible.

---

## RAG Query – Happy Path

This sequence defines the ideal flow for `/rag/grouped-query`.
It demonstrates how components interact to provide accurate, fast, and scoped responses to user queries using vector search, caching, prompt customization, and OpenAI.

## Sequence Overview

```
Client -> /rag/grouped-query
      -> Validate & extract input
      -> Load RAG config for group
      -> Check in-memory cache
      -> Run group-filtered vector search
      -> Build system prompt (template + tone)
      -> Call LLM with prompt + context
      -> Log audit + metadata
      -> Cache the result
      -> Return answer to client
```

## Steps in Detail

### 1. Input
- `query`: user’s natural language question
- `user_id`: ID of the user making the query
- `group_id`: used to scope retrieval to group documents
- `role`: used to customize the system prompt

### 2. Load Group Configuration
```python
rag_config = get_rag_config_for_group(group_id)
```
- Retrieves prompt template, tone, temperature override
- If not configured, defaults are used

### 3. Check Cache
```python
cached_result = get_cached_answer(user_id, query)
```
- If found, skip all downstream processing
- Return cached result immediately
- Log lightweight metadata to DB

### 4. Vector Search (Group Scoped)
```python
docs = query_vectorstore_with_group(query, group_id)
```
- Uses embedding similarity to retrieve top-k relevant chunks
- Filters by `group_id` for isolation

### 5. Build Prompt
```python
system_prompt = build_group_prompt(rag_config, role)
```
- Injects tone/role into the system message
- Example:
  ```
  You are a helpful professional assistant. Use only the group’s SOPs.
  ```

### 6. Model Execution
```python
result = process_query(...)
```
- Sends query + system prompt + vector context to OpenAI
- Measures latency and token usage
- Appends optional footer

### 7. Logging
```python
log_full_metadata()
```
- Writes to:
  - `AuditLog`: stores query, answer, role, documents used
  - `GenAIMetadata`: stores model stats, latency, token counts, group ID, cache flag

### 8. Caching
```python
set_cached_answer(user_id, query, result)
```
- Stores result in RAM (in-memory dictionary)
- Used to serve repeat queries instantly

### 9. Return Response
```json
{
  "answer": "...",
  "cached": false
}
```

## What Gets Tracked

| Field                | Description                                |
|---------------------|--------------------------------------------|
| `latency_ms`        | How long the OpenAI call took              |
| `tokens_input`      | Prompt tokens                              |
| `tokens_output`     | Completion tokens                          |
| `retrieved_docs`    | Number of matched vector chunks            |
| `cached`            | Whether the result came from cache         |
| `group_id`          | Group filter used for vector retrieval     |

## Security and Scope

- Each query runs through `check_prompt_security()` before anything else
- All documents retrieved are filtered by group
- Prompt templates are group-specific to control tone and behavior

## Testing

To test the happy path end-to-end:
1. Upload a group document via `/groups/{group_id}/documents`
2. Send a POST to `/rag/grouped-query` with:
   ```json
   {
     "query": "What are our Q4 SOPs?",
     "user_id": "user-123",
     "group_id": "group-456",
     "role": "analyst"
   }
   ```
3. You should see:
   - 200 OK response
   - Answer string
   - `cached: false` (first time)

---

## Supporting Routes

### Upload / Embed

| Method | Route                   | Purpose                        |
|--------|-------------------------|--------------------------------|
| POST   | /rag/upload/            | Upload PDF/TXT to vectorstore  |
| POST   | /groups/{id}/documents  | Upload group-specific document |
| GET    | /groups/{id}/documents  | List group’s uploaded docs     |

### Admin & System

| Method | Route                    | Description                         |
|--------|--------------------------|-------------------------------------|
| GET    | /admin/system-metrics    | System uptime, CPU, RAM             |
| GET    | /admin/logs/api          | Formatted GenAI query logs          |
| GET    | /admin/logs/flagged      | Logs flagged for security review    |
| GET    | /admin/recent-queries    | Recent deduplicated queries         |
| GET    | /admin/vector-search     | Global vector DB search             |
| GET    | /admin/chroma/index      | Stats on Chroma vector chunks       |

### Auth and Profile

| Method | Route               | Description              |
|--------|---------------------|--------------------------|
| POST   | /auth/login         | Get access + refresh     |
| POST   | /auth/refresh       | Refresh access token     |
| GET    | /me                 | Current user profile     |
| PUT    | /me                 | Update user profile      |

---

## Concurrency Model

- All core endpoints use **async def**
- Vector search, LLM calls, and DB writes are **non-blocking**
- Caching is RAM-based (dict); swap to Redis for scale
- SQLAlchemy `AsyncSession` used via FastAPI `Depends()`

---

## Summary

This architecture provides a full async, low-latency GenAI pipeline with scoped document retrieval and observability through metadata logging. Each component supports auditability and horizontal scaling.