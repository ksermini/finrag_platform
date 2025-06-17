
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
