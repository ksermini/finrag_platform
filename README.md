# FinRAG: FinTech RAG Platform

A secure, full-stack Generative AI application built for financial document analysis with Retrieval-Augmented Generation (RAG), operational metadata, and a role-based dashboard.

## Features
- User upload + chat interface with RAG
- Admin dashboard with latency/tokens/feedback insights
- Feedback logging and role-based authentication
- Operational metadata for monitoring + auditing
- FastAPI + ChromaDB + OpenAI + React + PostgreSQL

## Tech Stack
- Backend: FastAPI, SQLAlchemy, ChromaDB, OpenAI
- Frontend: React, Tailwind/Chakra UI, Axios
- Auth: JWT (bcrypt)
- Observability: LangSmith (optional)

## Getting Started

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
