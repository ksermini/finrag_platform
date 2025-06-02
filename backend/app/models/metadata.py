from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from datetime import datetime
from app.models.base import Base

class GenAIMetadata(Base):
    __tablename__ = "genai_metadata"

    id = Column(Integer, primary_key=True)
    query_id = Column(Integer, ForeignKey("audit_logs.id"))
    user_id = Column(String)
    model_name = Column(String)
    tokens_input = Column(Integer)
    tokens_output = Column(Integer)
    latency_ms = Column(Integer)
    retrieved_docs_count = Column(Integer)
    source_type = Column(String)
    timestamp = Column(DateTime, default=datetime.now)
    cached = Column(Boolean, default=False)  # store as "true"/"false"
    security_flagged = Column(Boolean, default=False)
    feedback_rating = Column(Integer, nullable=True)
    context_size = Column(Integer, nullable=True)
    security_footer = Column(Text, nullable=True)  # NEW: logs actual policy footer

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "model": self.model_name,
            "tokens_input": self.tokens_input,
            "tokens_output": self.tokens_output,
            "latency_ms": self.latency_ms,
            "retrieved_docs_count": self.retrieved_docs_count,
            "timestamp": self.timestamp.isoformat(),
            "cached": self.cached,
            "security_flagged": self.security_flagged,
            "feedback_rating": self.feedback_rating,
            "context_size": self.context_size,
            "security_footer": self.security_footer
        }
