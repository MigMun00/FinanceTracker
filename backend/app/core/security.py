from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from app.core.config import settings
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_access_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        "sub": subject,
        "exp": expire,
        "iat": now,
        "type": "access"
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

def create_refresh_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.refresh_token_expire_minutes)

    jti = str(uuid.uuid4())

    payload = {
        "sub": subject,
        "jti": jti,
        "exp": expire,
        "iat": now,
        "type": "refresh"
    }
    token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

    return token, jti

def decode_refresh_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        if payload.get("type") != "refresh":
            return None
        
        return payload
    except jwt.JWTError:
        return None


def hash_token(token: str) -> str:
    return pwd_context.hash(token)

def verify_refresh_token(token: str, hashed: str) -> bool:
    return pwd_context.verify(token, hashed)
