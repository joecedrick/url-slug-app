from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models, schemas
from . import utils
from .database import AsyncSessionLocal, engine
from . import database
import asyncio
from fastapi.middleware.cors import CORSMiddleware


items = []

# Create DB tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
            await conn.run_sync(models.Base.metadata.create_all)
            yield

app = FastAPI(lifespan=lifespan)

# allow cors
origins = [
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# post item to the server
@app.post("/links", response_model=schemas.URLInfo)
async def shorten_url(url: schemas.URLCreate, db: AsyncSession = Depends(database.get_db)):
    
    slug = utils.generate_slug()
    # Ensure unique slug
    result = await db.execute(select(models.URL).filter_by(slug=slug))
    while result.scalars().first():
        slug = utils.generate_slug()
        result = await db.execute(select(models.URL).filter_by(slug=slug))

    new_url = models.URL(slug=slug, original_url=url.original_url.scheme + '://' + url.original_url.host + url.original_url.path)
    db.add(new_url)
    await db.commit()
    await db.refresh(new_url)
    return new_url

@app.get("/all")
async def all(db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.URL))
    data = result.scalars().all()

    return data

@app.get("/{slug}")
async def redirect(slug: str, request: Request, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.URL).filter_by(slug=slug))
    url = result.scalars().first()
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    # Async increment click_count
    asyncio.create_task(increment_click_count(slug))
    return RedirectResponse(url.original_url, status_code=307, headers=[["Access-Control-Allow-Origin", "http://192.168.178.85:3000"]])

async def increment_click_count(slug: str):
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(models.URL).filter_by(slug=slug))
        url = result.scalars().first()
        if url:
            url.click_count += 1
            db.add(url)
            await db.commit()