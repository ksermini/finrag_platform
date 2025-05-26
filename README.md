
# FinRAG Platform

A full-stack Retrieval-Augmented Generation (RAG) system for AI engineering and internal observability in financial organizations.

**Author:** Kayla Sermini  
**Tech Stack:** Python (FastAPI), React, PostgreSQL, ChromaDB, OpenAI API  
**Type:** Portfolio | FinTech | Full-Stack AI Engineering | RAG System

---

## Overview

FinRAG enables group-aware document retrieval, real-time GenAI response generation, prompt personalization, and operational monitoring — all through a modular, production-ready architecture.

Key Capabilities:
- Group-based document retrieval and LLM responses
- Role-based access control (RBAC)
- Admin dashboard with user, group, and document management
- Prompt engineering per group (tone, template, temperature)
- Metadata logging for query performance, cache, tokens, and latency
- Real-time system metrics and alerts

---

## System Architecture

### Frontend (React + Tailwind)
- Login + Role-based Views
- Document Upload + Query Interface
- Admin Dashboard
- Audit & Metadata Panels

### Backend (FastAPI)
- `/auth/*` – JWT authentication
- `/query` – User queries
- `/upload`, `/embed` – Document ingestion
- `/admin/*` – Admin and metrics APIs

### Storage & Compute
- **ChromaDB** – Persistent vector store with group-level filtering
- **PostgreSQL** – Stores users, logs, group config, and metadata
- **LLM** – OpenAI GPT-3.5/GPT-4
- **Embeddings** – OpenAI

---

## Core Features

###  Query Flow
1. User submits a financial/business query
2. Backend retrieves RAG config for the user’s group
3. ChromaDB returns top-k context chunks (group-isolated)
4. Prompt dynamically constructed using tone/template
5. OpenAI GPT-4 (or Claude) returns an answer
6. Metadata and audit logs stored in PostgreSQL
7. Frontend displays result, metadata, and cache status

### Admin Capabilities
- Manage users, roles, and group memberships
- Upload documents to group-specific collections
- Monitor live system health, latency, token usage
- View query and ingestion history with audit drill-down
- Assign prompt strategies per group

### Access Control
- Role-Based UI (Admin, Viewer, Group Owner)
- Frontend dynamically adjusts to permissions
- Backend enforces access via group/user ID

---

## Prompt Engineering

Prompts are dynamically tailored using:
- Group tone and template (stored in DB)
- Retrieved ChromaDB context (group-scoped)
- Model config (temperature, retry logic, etc.)

**Prompt Example:**
```
System: "You are a helpful {tone} assistant for the finance team. Use only the SOPs provided to answer concisely."
User: "What are the liquidity ratios for JPMorgan in 2023?"
Context: [chunk 1], [chunk 2], ...
```

Metadata Logged:
- Query latency
- Token counts (input/output)
- Model used
- Cache status
- Context document count
- Retrieval rank and source

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 15+
- OpenAI API Key
- ChromaDB (local)

### 2. Backend Setup
```bash
cd backend/
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\Activate.ps1 on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend/
npm install
npm run dev  # Starts Vite server on http://localhost:5173
```

### 4. Cleanup Tools
```bash
# Clear Python cache
find . -name "__pycache__" -exec rm -r {} +

# Reset ChromaDB (optional)
rm -rf backend/data/chroma
```

---

## Metadata & Logging

| Table              | Purpose                                        |
|--------------------|------------------------------------------------|
| `genai_metadata`   | Stores token usage, latency, source, caching   |
| `audit_logs`       | Stores user prompts, answers, context used     |
| `group_documents`  | Tracks file uploads by group                   |
| `group_rag_config` | Stores prompt tone, template, and settings     |

---

## Example Use Cases
- Internal legal or financial advisors generating RAG answers scoped to group SOPs  
- Admins reviewing high-latency queries or cache misses in real time  
- Engineers debugging ingestion bottlenecks with metadata insight  
- Analysts experimenting with temperature tuning and prompt design per business unit  

---

## Roadmap

| Feature              | Description                                  |
|----------------------|----------------------------------------------|
| Feedback Loop        | Thumbs-up/down query scoring                 |
| LangGraph Agent Flow | Clarifying follow-ups via multi-agent graph |
| CI/CD Integration    | GitHub Actions and deployment scripts        |
| Plugin Framework     | Real-time stock API, calculator plugins      |
| Self-Healing Logs    | Sync fallback logs to main DB                |

---

## License & Attribution

This is a personal portfolio project demonstrating real-world GenAI system architecture for financial RAG systems. All designs, prompts, and implementations reflect best practices in modular, metadata-driven, full-stack AI engineering.
