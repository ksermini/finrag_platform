from fastapi import FastAPI
from app.routers import auth, user, admin, users
from fastapi.middleware.cors import CORSMiddleware
print("✅ FastAPI is loading main.py")

app = FastAPI()
from app.routers import feed
app.include_router(feed.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(admin.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:3000", "http://localhost:5173","127.0.0.1:53949", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)