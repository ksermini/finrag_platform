from pydantic import BaseModel
from uuid import UUID

class UserGroupAssign(BaseModel):
    user_id: int
    group_id: UUID
    role: str = "member"
