import uuid
from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from .database import Base

class URL(Base):
    __tablename__ = "urls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    slug = Column(String(8), nullable=False, index=True)
    original_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now())
    click_count = Column(Integer, default=0)