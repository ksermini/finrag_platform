from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
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
    email: Optional[EmailStr] = None
    hashed_password: Optional[str] = None

class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True
