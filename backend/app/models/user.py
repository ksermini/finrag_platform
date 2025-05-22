from sqlalchemy import Column, Integer, String
from app.models.base import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")  # "user" or "admin"


from sqlalchemy import Column, Integer, String, Float, DateTime, func
from app.database.database import Base

class UploadLog(Base):
    __tablename__ = "upload_logs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    user_id = Column(String, default="default")
    size_kb = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class QueryLog(Base):
    __tablename__ = "query_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    query = Column(String, nullable=False)
    latency_ms = Column(Float, nullable=False)
    top_k = Column(Integer, default=3)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
