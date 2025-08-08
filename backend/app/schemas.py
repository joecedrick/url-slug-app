from pydantic import BaseModel, HttpUrl
from datetime import datetime

class URLCreate(BaseModel):
    original_url: HttpUrl

class URLInfo(BaseModel):
    slug: str
    original_url: str
    created_at: datetime
    click_count: int

    class Config:
        orm_mode = True