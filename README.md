# FinRAG Platform

FinRAG is a secure, full-stack Generative AI platform for financial document analysis. It uses Retrieval-Augmented Generation (RAG), operational metadata tracking, and role-based dashboards to deliver reliable, auditable insights from financial data.

## Features

- Chat interface with Retrieval-Augmented Generation (RAG) for document QA
- Secure document upload and embedding using OpenAI and ChromaDB
- Role-based access with separate views for users and administrators
- Admin dashboard for monitoring latency, token usage, and user feedback
- Operational metadata and logging across all layers of the system
- Feedback logging with context for continuous improvement
- Built using FastAPI, PostgreSQL, ChromaDB, OpenAI, and React

## Tech Stack

### Backend

- FastAPI
- PostgreSQL with SQLAlchemy
- ChromaDB for vector similarity search
- OpenAI API
- JWT authentication
- bcrypt password hashing
- Optional integration with LangChain and LangSmith

### Frontend

- React
- Tailwind CSS and Chakra UI
- Axios for HTTP requests
- Vite development server

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js and npm
- PostgreSQL
- OpenAI API key

### Clone the Repository

```bash
git clone https://github.com/ksermini/finrag_platform.git
cd finrag_platform
```

## Backend Setup
```cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Create a .env file in backend/ with the following content:
```
OPENAI_API_KEY=your_openai_key
DATABASE_URL=postgresql://user:password@localhost:5432/finrag_db
SECRET_KEY=your_secret_key
```

### Run the backend server:
```
uvicorn app.main:app --reload
```

## Frontend Setup
```
cd frontend
npm install
```
### Create a .env file in frontend/ with the following content:
```
REACT_APP_API_URL=http://localhost:8000
```
### Run the frontend server:
```
npm run dev
```
Open your browser at http://localhost:5173

## Usage 

- Register and log in as a user or admin
- Upload financial documents (PDFs or text)
- Ask questions in the chat interface and receive generated answers
- Provide thumbs-up or thumbs-down feedback per message
- Admins can view system usage statistics and feedback logs

## Architecture Overview

- FastAPI handles API requests, authentication, and document processing
- PostgreSQL stores user data, logs, metadata, and feedback
- ChromaDB stores vector embeddings for document retrieval
- OpenAI API powers LLM generation
- React frontend communicates with backend via REST API

## Contributing
 
1. Fork the repository
2. Create a new branch
```
git checkout -b feature/your-feature-name
```
3. Make your changes
4. Commit and push
```
git commit -m "Add your feature"
git push origin feature/your-feature-name
```
5. Open a pull request

## Contact
For issues or questions, please open a GitHub issue at

https://github.com/ksermini/finrag_platform/issues