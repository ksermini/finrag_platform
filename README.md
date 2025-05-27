
# FinRAG Platform




**Full-Stack RAG System for Financial Workflows**  
Built with FastAPI, React, PostgreSQL, ChromaDB, and OpenAI.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Use Cases](#use-cases)
- [API Routes](#api-routes)
- [Data Dictionary](#data-dictionary)
- [Screenshots](#screenshots)
- [License](#license)

---

## Overview

FinRAG is a full-stack Retrieval-Augmented Generation (RAG) platform designed for internal AI engineering in financial organizations. It supports:

- Financial document ingestion + embedding
- Group-aware RAG query routing
- Role-based prompt engineering
- Operational metadata logging (latency, token usage, caching)
- Full admin portal with audit logs, user management, system health, and usage metrics
- 
![image](https://github.com/user-attachments/assets/d213c89d-e67a-4a18-89d9-e1828b9d8828)
![image](https://github.com/user-attachments/assets/bf7867a5-e16b-4ca7-a76c-baf03ad817f0)
---
---

## Architecture

```
FastAPI (Backend)
├── Auth, RBAC, Audit Logging
├── RAG Query Engine
│   └── LangGraph + OpenAI API
├── Metadata Logger
├── Vector Store (ChromaDB)
└── PostgreSQL

React (Frontend)
├── User Query Interface
└── Admin Portal
    ├── User Management
    ├── Group Prompts
    ├── Live Metadata
    └── Document Management
```

---

## Features

- Group Vector Isolation for secure knowledge retrieval
- Prompt configuration per group (tone, temperature, template)
- Role-Based Access Control (RBAC)
- Query caching and feedback loop
- Admin dashboard for users, logs, metrics, and vectors
## Query Caching (Performance Optimization)

The FinRAG platform includes a built-in caching layer to avoid redundant LLM calls and speed up repeated queries.

### How It Works:

1. **Unique Hashing**
   - A hash is generated using the combination of `query`, `user_id`, `group_id` (if present), and `role`.
   - This ensures role- and group-specific answers are cached independently.

2. **Lookup & Response**
   - If the hash exists in the cache store, the saved response is returned with `"cached": true`.
   - If not, the system runs full document retrieval and LLM generation, then stores the result.

3. **Persistent Store**
   - Caching is currently implemented using a local or on-disk store (e.g. ChromaDB or serialized JSON).
   - Future versions may include Redis for distributed deployments.

### Example:
```json
{
  "query": "Summarize Apple’s latest 10-Q",
  "user_id": "user42",
  "group_id": "finops_team",
  "role": "analyst"
}
```
 Returns cached response if this exact combination was asked before.

---

## System Relationships: Groups, Users, and Documents

### Groups

- Each **Group** represents a business unit or domain (e.g. Finance, Risk, Ops).
- Groups have:
  - A name, description
  - A default agent role for prompt engineering
  - A unique set of embedded documents in the vector store

### Users

- Users can belong to **multiple groups**, each with an assigned **role** (e.g. `member`, `manager`, `reviewer`).
- Each user’s query context is scoped by their group and role, enabling fine-tuned responses.
- Profile metadata includes: job title, department, access level, manager, and custom notes.

### Documents

- Documents are always **associated with a group** — never global.
- Uploading a document to `/groups/{group_id}/documents`:
  - Extracts text from PDF/TXT
  - Splits it into chunks
  - Embeds into a **group-specific** vectorstore
- Each document stores metadata:
  - Title, upload timestamp, embedded status, author, and file path

### Flow Summary

1. **User logs in /me/**
2. System determines **primary group**
3. User uploads a doc assigned to group
4. User submits a query:
   - Group and role affect prompt
   - Vectorstore retrieves group-specific context
   - Answer is generated and optionally cached

---
##  Embeddings + Vector Database Integration

The FinRAG platform connects a semantic vector database (ChromaDB) to a relational PostgreSQL backend, allowing for both high-performance retrieval and full metadata observability.

### How Embeddings Work

1. **Document Ingestion**
   - Users or admins upload a file via `/user/upload/` or `/groups/{group_id}/documents`.
   - The system extracts text, splits it into logical chunks (~200–500 tokens), and generates embeddings using OpenAI or another model.

2. **ChromaDB Storage**
   - Each chunk is stored in ChromaDB with:
     - The original text
     - Its vector embedding
     - Associated metadata (e.g., `user_id`, `group_id`, `filename`, `chunk_index`)
   - Chroma uses a persistent directory (`/data/chroma`) to ensure vectors survive reboots.

3. **Metadata Logging in PostgreSQL**
   - For every query, a matching record is written to the `genai_metadata` table:
     - `tokens_input`, `tokens_output`
     - `retrieved_docs_count`
     - `latency_ms`
     - `model_name`, `user_id`, and `cached` flag
   - Documents themselves are also stored in PostgreSQL (`group_documents`), with metadata like `title`, `embedded`, and `created_by`.

### Why This Architecture?

- **ChromaDB** enables fast, approximate vector search on semantic similarity.
- **PostgreSQL** provides reliable auditability, role-based filtering, and performance tracking for compliance and observability.
- This hybrid setup allows:
  - Real-time GenAI queries
  - Historical tracking of model cost and usage
  - Secure document ownership + access control

---


---

## Group-Based Embeddings & Prompt Engineering

The FinRAG platform uses a dynamic, metadata-driven approach to how documents are embedded and how queries are constructed, personalized, and answered — all scoped by **group context**.

---

### Embeddings per Group (Context Isolation)

Each group has its **own isolated vector store namespace**:

- When a document is uploaded to a group (via `/groups/{group_id}/documents`), its content is:
  1. Extracted into clean text
  2. Split into semantic chunks (using length- and meaning-based logic)
  3. Embedded using OpenAI's `text-embedding-ada-002` or similar model
  4. Stored in **ChromaDB** with metadata: `group_id`, `filename`, `chunk_number`, etc.

- These chunks are retrievable **only for queries from users in that group**, preserving domain privacy and relevance.

---

### Dynamic Prompt Engineering (Per Group Customization)

Each group can have its own **prompt template, tone, and temperature** stored in the `rag_group_config` table.

#### Fields:
- `prompt_template`: A customizable Jinja-style prompt with placeholders for context and role
- `tone`: Describes the voice of the AI (e.g., "professional", "casual", "critical", "financial advisor")
- `temperature`: Controls randomness:
  - Low (`0.0–0.3`): Conservative, factual answers
  - Medium (`0.4–0.6`): Balanced creativity
  - High (`0.7–1.0`): More creative, exploratory

---

### Query Execution Flow

When a user submits a query:

1. **Identify Group + Role Context**
   - The system fetches the user's primary group and their assigned role within it.

2. **Load Prompt Settings**
   - Pulls prompt config from `rag_group_config` using `group_id`.

3. **Construct Prompt Dynamically**
   - Injects:
     - `retrieved_docs` into the prompt body
     - `user_role` and `tone` into the system message or instruction block

4. **Run LLM Completion**
   - Sends the final prompt to OpenAI or Claude with specified `temperature`.

5. **Log Metadata**
   - Stores tokens, latency, selected model, and prompt strategy in `genai_metadata`.

---

### Example

```json
Group Config:
{
  "tone": "analytical",
  "temperature": 0.3,
  "prompt_template": "You are an {role} analyzing financial documents. Answer the following based only on the provided content: {context}"
}
```

```plaintext
Final Prompt:
"You are an analyst analyzing financial documents. Answer the following based only on the provided content: 
[chunk_1]
[chunk_2]
...
Q: What was the revenue growth rate?"
```

---

### Benefits

- **Contextual Relevance**: Each group sees only its own documents
- **Custom Behavior**: Prompt output can be formal or casual, strict or creative
- **Security & Observability**: Every prompt, answer, and token usage is tracked

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ksermini/finrag_platform.git
cd finrag_platform
```

### 2. Backend Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Create `.env` File

```env
OPENAI_API_KEY=your_openai_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/finrag_db
JWT_SECRET_KEY=your_jwt_secret
```

### 4. Initialize the Database

```bash
alembic upgrade head
```

### 5. Run the Backend Server

```bash
uvicorn app.main:app --reload
```

### 6. Frontend (Optional)

```bash
cd frontend
npm install
npm run dev
```

---

## Use Cases

- **Financial Analysis**: Summarize and extract insights from uploaded earnings reports.
- **Compliance & SOP**: Retrieve group-specific answers for internal procedures.
- **Research Assistance**: Quickly answer user queries using internal financial documents.
- **System Monitoring**: Admins review query performance and flag bottlenecks using metadata.

---


# FinRAG API Reference

This document contains a complete reference for all API endpoints supported by the FinRAG platform.

---

## RAG Operations

### `POST /rag/query`
Execute a standard RAG query using embedded documents and user context.

### `POST /rag/grouped-query`
Execute a group-aware RAG query using custom prompts, tone, and group vector isolation.

### `POST /rag/upload/`
Upload a document for RAG ingestion (PDF or TXT) and embed it to ChromaDB.

### `GET /rag/group-info`
Get metadata about the user’s primary group (e.g., name, default agent role).

### `GET /rag/test-token`
Verify a user's JWT token by returning the associated user email.

---

## Feed

### `GET /feed/news`
Returns top 10 financial news headlines from MarketWatch RSS feed.

---

## Group Management

### `POST /groups/`
Create a new user group with optional description and default agent role.

### `GET /groups/`
List all groups and their metadata.

### `POST /groups/{group_id}/documents`
Upload and embed a document for a specific group.

### `GET /groups/{group_id}/documents`
List documents associated with a specific group.

### `POST /groups/{group_id}/add-user`
Add a user to a group using path params.

### `GET /groups/{group_id}/users`
List users assigned to a specific group.

### `POST /groups/assign`
Assign a user to a group using structured payload.

---

## User Profile

### `GET /me/`
Get profile of the current authenticated user.

### `PUT /me/`
Update fields in current user’s profile.

### `GET /me/email/{email}`
Get user details by email.

### `GET /me/users/{user_id}/group`
Get primary group for a specific user ID.

---

## User Uploads

### `POST /user/upload/`
Upload a personal document for vector embedding (PDF or TXT).

---

## Authentication

### `POST /auth/register`
Register a new user.

### `POST /auth/login`
Authenticate user and return JWT token.

---

## Admin – Users

### `GET /admin/users/`
List all users (admin only).

### `POST /admin/users/`
Create a new user.

### `PUT /admin/users/{user_id}`
Update an existing user's profile.

---

## Admin – GenAI Monitoring

### `GET /admin/vector-search`
Perform a vector similarity search using a query string.

### `GET /admin/audit/logs`
Return latest 50 entries from the GenAI audit log.

### `GET /admin/logs/api`
Summarize recent API log entries.

### `GET /admin/system-metrics`
Return backend system metrics (uptime, CPU, RAM, query stats).

### `GET /admin/recent-queries`
Return deduplicated recent queries from GenAI metadata.

### `GET /admin/alerts`
Run a health check and return alert report.

### `GET /admin/chroma/index`
Return stats about ChromaDB: chunk distribution and vector count.


---
## Data Dictionary

### `alembic_version`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| version_num | character varying | NO |  |

### `audit_logs`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | integer | NO | nextval('audit_logs_id_seq'::regclass) |
| user_id | character varying | YES |  |
| query | text | YES |  |
| answer | text | YES |  |
| source_docs | json | YES |  |
| role | character varying | YES |  |
| timestamp | timestamp without time zone | YES |  |

### `feedback`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | integer | NO | nextval('feedback_id_seq'::regclass) |
| query_id | integer | YES |  |
| rating | character varying | YES |  |
| comments | text | YES |  |
| timestamp | timestamp without time zone | YES |  |

### `genai_metadata`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | integer | NO | nextval('genai_metadata_id_seq'::regclass) |
| query_id | integer | YES |  |
| user_id | character varying | YES |  |
| model_name | character varying | YES |  |
| tokens_input | integer | YES |  |
| tokens_output | integer | YES |  |
| latency_ms | integer | YES |  |
| retrieved_docs_count | integer | YES |  |
| source_type | character varying | YES |  |
| timestamp | timestamp without time zone | YES |  |
| cached | character varying | YES |  |

### `group_documents`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO |  |
| group_id | uuid | NO |  |
| title | text | YES |  |
| content | text | YES |  |
| file_path | text | YES |  |
| embedded | boolean | YES | false |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
| created_by | character varying | YES |  |

### `groups`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO |  |
| name | text | YES |  |
| description | text | YES |  |
| default_agent_role | text | YES |  |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |

### `query_logs`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | integer | NO | nextval('query_logs_id_seq'::regclass) |
| user_id | character varying | NO |  |
| query | character varying | NO |  |
| latency_ms | double precision | NO |  |
| top_k | integer | YES |  |
| timestamp | timestamp with time zone | YES | now() |

### `rag_group_config`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| group_id | uuid | NO |  |
| tone | text | YES | 'professional'::text |
| temperature | double precision | YES | 0.7 |
| prompt_template | text | YES |  |
| enabled | boolean | YES | false |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |

### `upload_logs`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | integer | NO | nextval('upload_logs_id_seq'::regclass) |
| filename | character varying | NO |  |
| user_id | character varying | YES |  |
| size_kb | double precision | NO |  |
| timestamp | timestamp with time zone | YES | now() |

### `user_groups`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| user_id | integer | NO |  |
| group_id | uuid | NO |  |
| role | character varying | NO | 'member'::character varying |
| added_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |

### `users`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | integer | NO | nextval('users_id_seq'::regclass) |
| email | character varying | NO |  |
| first_name | character varying | NO |  |
| last_name | character varying | NO |  |
| hashed_password | character varying | NO |  |
| is_active | boolean | NO | true |
| role | character varying | NO | 'USER'::character varying |
| business_group | character varying | YES |  |
| is_admin | boolean | YES |  |
| permissions | character varying | YES |  |
| created_at | timestamp without time zone | NO | CURRENT_TIMESTAMP |
| last_login | timestamp without time zone | YES |  |
| account_status | character varying | NO | 'pending'::character varying |
| phone_number | character varying | YES |  |
| department | character varying | YES |  |
| job_title | character varying | YES |  |
| manager_id | integer | YES |  |
| created_by | integer | YES |  |
| updated_at | timestamp without time zone | YES |  |
| notes | character varying | YES |  |


## Screenshots

![image](https://github.com/user-attachments/assets/f1b8f8d9-0e5f-491f-a907-8122f15df868)
![image](https://github.com/user-attachments/assets/bc33c659-7bdd-47ef-a036-835e5e70ffd4)
![image](https://github.com/user-attachments/assets/81bea68a-a3a7-4718-8dc3-dec7e2ceaa72)

![image](https://github.com/user-attachments/assets/6319ffb6-7f4a-4b81-80f7-01f9c114ffaf)
![image](https://github.com/user-attachments/assets/0a8f8b6c-2aeb-4792-bd4a-b12c21900976)
![image](https://github.com/user-attachments/assets/f0d250b6-a914-46c1-b025-c342a406937c)
![image](https://github.com/user-attachments/assets/bfa45a0d-fcc4-48f7-8c29-d6c39e7afe45)
![image](https://github.com/user-attachments/assets/fa437e99-3fd4-4e4c-95c1-33f9f86b4823)
![image](https://github.com/user-attachments/assets/5b1e87bb-585f-4587-b6a7-6b4ddf2e991d)
![image](https://github.com/user-attachments/assets/89748ba3-ac1e-4465-b8b0-11695d484dcf)



---

## License

This project is for educational and portfolio use only. Not licensed for commercial use. Contact for collaboration.
