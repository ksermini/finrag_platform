from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, UUID
from datetime import datetime
from app.models.base import Base
import uuid

class GroupDocument(Base):
    __tablename__ = "group_documents"
    __table_args__ = {"extend_existing": True}  # ✅ This line resolves the error

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    file_path = Column(String, nullable=True)
    embedded = Column(Boolean, default=False)
    created_by = Column(String, default="system")
    created_at = Column(DateTime, default=datetime.now)
