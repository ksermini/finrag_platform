from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterRequest(BaseModel):
    """Validating that the required fields are not missing"""
    email: EmailStr
    password: str
    first_name: str
    last_name: str
