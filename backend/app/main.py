from fastapi import FastAPI
from app.core.config import settings
from app.routers import auth, users, categories, transactions, reports
from app.core.middleware import setup_middleware

app = FastAPI(title=settings.app_name)

setup_middleware(app)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(transactions.router)
app.include_router(reports.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}