
# Group-Based Embeddings & Prompt Engineering

The FinRAG platform uses metadata-driven prompt construction and scoped embeddings to ensure every query is tailored to its group context. This enables precision, security, and custom behavior per business unit.

---

## Embeddings per Group

Each group has its **own isolated namespace** within the vector database. This guarantees that document context is:

- Private to the group
- Retrieved only for group-authorized queries
- Embedded with group-specific metadata for filtering

### Ingestion Flow

1. **User uploads a file** via `/groups/{group_id}/documents`
2. Text is extracted and split into chunks (~500 tokens)
3. Each chunk is embedded using a model like `text-embedding-ada-002`
4. Chunks are stored in **ChromaDB** with metadata:
   - `group_id`
   - `filename`
   - `chunk_index`
   - `user_id`

These embeddings are only retrieved when a user in that group submits a query.

---

## Dynamic Prompt Engineering

Each group can define its **own prompt behavior**, enabling fully customized tone, structure, and creativity.

### Prompt Config Fields

- `prompt_template`: Template that defines system prompt structure. Uses `{context}` and `{role}` placeholders.
- `tone`: Voice of the assistant (e.g., "analytical", "casual", "strict")
- `temperature`: Creativity level for the LLM output
  - `0.0–0.3`: Conservative, factual
  - `0.4–0.6`: Balanced
  - `0.7–1.0`: Exploratory, creative

These are stored in the `rag_group_config` table and loaded dynamically.

---

## Query Execution Flow

1. **Group and Role Resolution**
   - Query request includes `group_id`, `user_id`, and optionally `role`
   - If omitted, defaults are pulled from the user profile or group settings

2. **Prompt Preparation**
   - `rag_group_config` is queried using `group_id`
   - Template is filled with:
     - Retrieved vectorstore context (`context`)
     - User-assigned or default role (`role`)
     - Group tone setting (`tone`)

3. **Model Execution**
   - Constructed prompt and context are passed to the LLM (e.g., GPT-4)
   - Temperature is applied to control creativity

4. **Metadata Logging**
   - Query execution is logged in PostgreSQL (`genai_metadata` and `audit_logs`)
   - Captures:
     - `tokens_input`, `tokens_output`
     - `latency_ms`
     - `retrieved_docs_count`
     - `cached` flag
     - `model_name`

---

## Example Prompt Flow

```json
Group Config:
{
  "tone": "analytical",
  "temperature": 0.3,
  "prompt_template": "You are a financial {role}. Based on the following documents, answer the query precisely: {context}"
}
```

```plaintext
Final System Prompt:
"You are a financial analyst. Based on the following documents, answer the query precisely:

[chunk_1]
[chunk_2]
...

Q: What is the expected impact on EPS?"
```

---

## Benefits

- **Isolation**: No group can access another’s context
- **Customization**: Prompts adapt to department tone and goals
- **Observability**: Every variable in the generation process is logged
