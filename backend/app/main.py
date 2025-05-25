from fastapi import FastAPI
from app.routers import auth, admin
from fastapi.middleware.cors import CORSMiddleware
print("✅ FastAPI is loading main.py")
from app.routers import rag_routes
from app.routers import admin_users, public_users

app = FastAPI()
from app.routers import group_documents
app.include_router(group_documents.router)

app.include_router(rag_routes.router)

app.include_router(admin_users.router)
app.include_router(public_users.router)
from app.routers import feed
app.include_router(feed.router)
app.include_router(auth.router)
app.include_router(admin.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:3000", "http://localhost:5173","127.0.0.1:53949", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)