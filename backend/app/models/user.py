from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime
from app.models.base import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    last_login = Column(DateTime, nullable=True)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, nullable=True)
    department = Column(String, nullable=True)
    permissions = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    account_status = Column(String, default="pending")
    business_group = Column(String, nullable=True)
