# app/routers/grouped_rag_router.py

from fastapi import APIRouter, Depends, HTTPException
from app.services.auth_service import get_current_user
from app.models.user import User
from app.services.group_helpers import get_user_primary_group
from app.vector_store import query_vectorstore_with_group
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter(prefix="/rag", tags=["RAG"])

@router.post("/grouped-query")
async def grouped_query(query: str, user: User = Depends(get_current_user)):
    group = await get_user_primary_group(user.id)
    if not group:
        raise HTTPException(status_code=404, detail="User is not in a group")

    role = group.default_agent_role or "domain expert"
    context_docs = query_vectorstore_with_group(query, group.id)
    context = "\n\n".join(context_docs)

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"You are a helpful {role}. Use only the group's SOPs below to answer:"},
            {"role": "user", "content": f"{context}\n\nQ: {query}"}
        ]
    )

    return {"answer": response.choices[0].message.content}
