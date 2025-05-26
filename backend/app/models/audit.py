from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from app.models.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String)
    query = Column(Text)
    answer = Column(Text)
    source_docs = Column(JSON)
    role = Column(String)
    timestamp = Column(DateTime, default=datetime.now)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "query": self.query,
            "answer": self.answer,
            "source_docs": self.source_docs,
            "role": self.role,
            "timestamp": self.timestamp.isoformat()
        }
