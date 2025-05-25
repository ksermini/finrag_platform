from app.db import Base
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from uuid import uuid4

# ✅ Ensure SQLAlchemy sees the users table for FK resolution
from app.models.user import User


class Group(Base):
    __tablename__ = "groups"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, unique=True)
    description = Column(String)
    default_agent_role = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserGroup(Base):
    __tablename__ = "user_groups"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id"), primary_key=True)
    role = Column(String, default="member")
    added_at = Column(DateTime, default=datetime.utcnow)


class GroupDocument(Base):
    __tablename__ = "group_documents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id"))
    title = Column(String)
    content = Column(String)
    file_path = Column(String)
    embedded = Column(Boolean, default=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Optional: enable reverse access to user.uploaded_group_docs
    created_by_user = relationship("User", backref="uploaded_group_docs")
