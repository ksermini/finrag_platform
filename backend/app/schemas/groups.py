from pydantic import BaseModel
from uuid import UUID

class UserGroupAssign(BaseModel):
    """
    Assigning the correct type per id
    """
    user_id: int
    group_id: UUID
    role: str = "member"
