
# FinRAG Platform

**Full-Stack RAG System for Financial Workflows**  
Built with FastAPI, React, PostgreSQL, ChromaDB, LangGraph, and OpenAI.

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

---

## Features

- Group Vector Isolation for secure knowledge retrieval
- Prompt configuration per group (tone, temperature, template)
- Role-Based Access Control (RBAC)
- Query caching and feedback loop
- Admin dashboard for users, logs, metrics, and vectors

---

## Architecture

```
FastAPI (Backend)
âââ Auth, RBAC, Audit Logging
âââ RAG Query Engine
â   âââ LangGraph + OpenAI API
âââ Metadata Logger
âââ Vector Store (ChromaDB)
âââ PostgreSQL

React (Frontend)
âââ User Query Interface
âââ Admin Portal
    âââ User Management
    âââ Group Prompts
    âââ Live Metadata
    âââ Document Management
```

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

## API Routes

### Auth

| Method | Route              | Description              |
|--------|--------------------|--------------------------|
| POST   | `/auth/login`      | Login and get JWT token  |
| POST   | `/auth/register`   | Register a new user      |

### RAG

| Method | Route            | Description                      |
|--------|------------------|----------------------------------|
| POST   | `/rag/query`     | Submit a query to RAG pipeline  |
| GET    | `/rag/feedback`  | Retrieve past feedback logs     |

### Admin/Users

| Method | Route             | Description                   |
|--------|-------------------|-------------------------------|
| GET    | `/admin/users`    | List all users (admin only)   |
| PUT    | `/admin/users/:id`| Update a user profile         |
| DELETE | `/admin/users/:id`| Delete a user                 |

### Admin/Groups

| Method | Route               | Description                    |
|--------|---------------------|--------------------------------|
| GET    | `/admin/groups`     | Get all business groups        |
| POST   | `/admin/groups`     | Create a new group             |
| PUT    | `/admin/groups/:id` | Update group settings          |

### Admin/Documents

| Method | Route                   | Description                |
|--------|-------------------------|----------------------------|
| POST   | `/admin/documents/upload` | Upload financial documents |
| GET    | `/admin/documents`     | View uploaded docs         |

---

## Data Dictionary

### Users

| Column         | Type     | Description                    |
|----------------|----------|--------------------------------|
| id             | UUID     | Unique user ID                 |
| email          | String   | User email                     |
| first_name     | String   | First name                     |
| last_name      | String   | Last name                      |
| role           | String   | Role (admin, user, analyst)    |
| business_group | String   | Group membership               |
| created_at     | DateTime | Account creation timestamp     |
| last_login     | DateTime | Last login timestamp           |

### GenAI Metadata

| Column            | Type     | Description                             |
|-------------------|----------|-----------------------------------------|
| query_id          | Integer  | Link to audit log                       |
| user_id           | String   | User who submitted the query            |
| model_name        | String   | LLM used (gpt-4, claude, etc.)          |
| tokens_input      | Integer  | Input token count                       |
| tokens_output     | Integer  | Output token count                      |
| latency_ms        | Integer  | Response time in milliseconds           |
| retrieved_docs    | Integer  | Docs retrieved from vectorstore         |
| cached            | Boolean  | Whether the response came from cache    |
| timestamp         | DateTime | ISO timestamp with timezone             |

### Documents

| Column       | Type     | Description              |
|--------------|----------|--------------------------|
| id           | UUID     | Document ID              |
| group_id     | UUID     | Linked group             |
| title        | String   | Document title           |
| content      | Text     | Full text content        |
| uploaded_by  | UUID     | User who uploaded        |
| created_at   | DateTime | Upload timestamp         |

---

## Screenshots



---

## License

This project is for educational and portfolio use only. Not licensed for commercial use. Contact for collaboration.