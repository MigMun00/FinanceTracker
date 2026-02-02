from fastapi import FastAPI
from app.core.config import settings
from app.routers import auth, users

app = FastAPI(title=settings.app_name)

app.include_router(auth.router)
app.include_router(users.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}