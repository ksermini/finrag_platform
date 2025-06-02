from pydantic import BaseModel
from typing import Optional

class ModelQueryRequest(BaseModel):
    query: str
    user_id: str
    group_id: Optional[str]
    role: Optional[str] = "user"
    model: str  
    temperature_override: Optional[float] = 0.7
    context_override: Optional[str] = None
    system_override: Optional[str] = None
    footer_override: Optional[str] = None


class ModelSelection(BaseModel):
    model: str
