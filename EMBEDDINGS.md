# Embeddings & Vector Database Integration

The FinRAG platform tightly integrates semantic search (via ChromaDB) with traditional metadata logging (via PostgreSQL), enabling high-performance retrieval, traceability, and observability.

## How Embeddings Work

### 1. Document Ingestion Pipeline

- Files are uploaded through group-based endpoints like `/groups/{group_id}/documents`.
- Upon upload:
  - The raw file is saved temporarily and parsed using custom file extractors (e.g., PDF parser).
  - Extracted text is split into overlapping chunks using semantic-aware chunking (default: 500 tokens with 50 overlap).
  - Each chunk is passed through a vector embedding model (e.g., `text-embedding-ada-002`) to convert it into a high-dimensional vector.

### 2. Vector Store: ChromaDB

- **Storage**: Each chunk is stored in ChromaDB using the `PersistentClient` API with associated metadata.
  - Metadata includes: `user_id`, `group_id`, `filename`, `chunk_index`
  - This enables group-based vector isolation and scoped querying.
- **Persistence**: All vectors are saved to disk (`/data/chroma`) to ensure state recovery across service restarts or crashes.
- **Querying**: When a user submits a query, the query is embedded and used to retrieve the top-N most semantically similar document chunks.
  - If scoped by group, only chunks with matching `group_id` are considered.

### 3. Metadata Logging in PostgreSQL

For every query, the platform logs metadata in the `genai_metadata` table to track performance, security, and system behavior:

- `tokens_input`, `tokens_output`: Tracks LLM cost and verbosity.
- `latency_ms`: Measures end-to-end duration of the query lifecycle.
- `retrieved_docs_count`: Number of chunks returned from the vector store.
- `cached`: Boolean indicating if the result was fetched from the cache.

Additionally, uploaded documents are recorded in the `group_documents` table with metadata including:

- Document title, embedded status, associated group, upload timestamp, and uploader ID.

## Architecture Diagram (Textual)

```
            ┌────────────────────────────┐
            │      Upload Document       │
            └────────────┬───────────────┘
                         ▼
                ┌─────────────────┐
                │ Extract Text    │
                └─────────────────┘
                         ▼
                ┌─────────────────┐
                │ Chunk Text      │
                └─────────────────┘
                         ▼
                ┌──────────────────────┐
                │ Generate Embeddings  │ ←────────────┐
                └──────────────────────┘              │
                         ▼                            │
      ┌─────────────────────────────┐       ┌────────────────────────────┐
      │ Store in ChromaDB (vectors) │       │ Log metadata to PostgreSQL │
      └─────────────────────────────┘       └────────────────────────────┘
```

## Why This Design?

- **Separation of Concerns**: Embeddings power relevance; PostgreSQL powers traceability.
- **Auditability**: Every interaction is tracked with full metadata.
- **Group-Based Privacy**: Chroma queries respect group boundaries through scoped metadata filters.
- **Scalability**: ChromaDB allows fast semantic search, while PostgreSQL can be horizontally scaled or archived for long-term logs.

## Future Enhancements

- Add support for **hybrid search** (keyword + vector).
- Migrate cache and embeddings to **distributed Redis or Pinecone** for multi-node scaling.
- Expand PostgreSQL metadata logging to include **feedback loops** and **query fingerprinting**.