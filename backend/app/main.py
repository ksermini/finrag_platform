from fastapi import FastAPI
from app.routers import auth, user, admin
from fastapi.middleware.cors import CORSMiddleware
print("✅ FastAPI is loading main.py")

app = FastAPI()

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(admin.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)