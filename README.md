
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
