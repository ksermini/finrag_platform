from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.core.container import container
from app.routers import auth, user, admin, users, feed

def create_app() -> FastAPI:
    app = FastAPI(
        title="FinRAG Platform",
        description="A RAG-based financial document processing platform",
        version="1.0.0",
        docs_url=f"{settings.API_PREFIX}/docs",
        redoc_url=f"{settings.API_PREFIX}/redoc",
        openapi_url=f"{settings.API_PREFIX}/openapi.json"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers with API prefix
    app.include_router(feed.router, prefix=settings.API_PREFIX)
    app.include_router(users.router, prefix=settings.API_PREFIX)
    app.include_router(auth.router, prefix=settings.API_PREFIX)
    app.include_router(user.router, prefix=settings.API_PREFIX)
    app.include_router(admin.router, prefix=settings.API_PREFIX)
    
    # Add container to app state
    app.container = container
    
    return app

app = create_app()