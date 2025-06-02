# Features

## Group Vector Isolation  
Each group (e.g., Finance, Risk, Ops) has its own **isolated vector namespace** in ChromaDB.  
This ensures that:

- Documents from one group are **never exposed** to others
- Queries retrieve only **group-relevant embeddings**
- Domain-specific context is maintained

## Custom Prompt Configuration  
Every group can define its own:

- `prompt_template`: Controls how the system message is constructed (e.g., formal, advisory, concise)
- `tone`: Sets the voice of the assistant (e.g., “professional”, “casual”, “analytical”)
- `temperature`: Controls randomness and creativity in answers

This allows LLMs to behave differently based on **organizational context**.

## Role-Based Access Control (RBAC)  
Users are mapped to groups and assigned roles (e.g., `member`, `manager`, `reviewer`).  
This enables:

- Tailored query behavior based on the user’s **domain and seniority**
- Filtering of audit logs and vectors by user access
- Admin-only capabilities for document ingestion and config updates

## Query Caching and Feedback Loop  
A caching layer reduces latency and cost by returning prior results when queries are repeated.  
The system stores:

- Query hash (user, group, role, prompt)
- Model result (cached or fresh)
- Performance metrics (latency, token count)

Users can also leave **feedback** to improve system relevance.

## Admin Dashboard  
A visual management panel lets admins:

- View and manage users and roles
- Track model metrics (token usage, latency)
- Explore vectorstore embeddings
- Monitor system health and logs

Built to ensure transparency, compliance, and operational clarity.