from pydantic import BaseModel, EmailStr
from typing import Optional

# Defines the structure of user data
# Starting SOC: what can be changed, added, read

class UserBase(BaseModel):
    """Optional Fields"""
    email: EmailStr
    role: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = True
    is_admin: Optional[bool] = False
    manager_id: Optional[int] = None
    created_by: Optional[int] = None
    department: Optional[str] = None
    permissions: Optional[str] = None
    job_title: Optional[str] = None
    notes: Optional[str] = None
    account_status: Optional[str] = "active"
    business_group: Optional[str] = None

class UserCreate(BaseModel):
    """Required fields to create a new user"""
    email: str
    first_name: str
    last_name: str
    role: str
    business_group: str
    account_status: str
    phone_number: str
    job_title: str
    department: str
    is_admin: bool
    is_active: bool
    password: str  # Required field


class UserUpdate(UserBase):
    """Optional for updating a user"""
    email: Optional[EmailStr] = None
    hashed_password: Optional[str] = None

# What will be sent to the frontend with int attatched
class UserRead(UserBase):
    id: int
    # Serialized fields for output
    class Config:
        orm_mode = True
