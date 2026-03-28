from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.config import settings
from app.core.deps import get_db
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, hash_token, \
    verify_refresh_token, decode_refresh_token
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.schemas import UserCreate, TokenResponse, RefreshRequest

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == str(data.email)))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user = User(
        email=str(data.email),
        password_hash=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"id": user.id, "email": user.email}


@router.post("/login", response_model=TokenResponse)
def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    user = db.scalar(select(User).where(User.email == str(form_data.username)))

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Create tokens
    access_token = create_access_token(subject=str(user.id))
    refresh_token, jti = create_refresh_token(subject=str(user.id))

    # Store hashed refresh token
    db_token = RefreshToken(
        user_id=user.id,
        jti=jti,
        token_hash=hash_token(refresh_token),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.refresh_token_expire_minutes)
    )

    db.add(db_token)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

@router.post("/refresh", response_model=TokenResponse)
def refresh(request: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_refresh_token(request.refresh_token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    jti = payload.get("jti")

    db_token = db.query(RefreshToken).filter(RefreshToken.jti == jti).first()

    if not db_token or db_token.revoked:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Token expired")

    if not verify_refresh_token(request.refresh_token, db_token.token_hash):
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Rotate token
    db_token.revoked = True
    db.commit()

    new_refresh, new_jti = create_refresh_token(str(db_token.user_id))

    new_db_token = RefreshToken(
        user_id=db_token.user_id,
        jti=new_jti,
        token_hash=hash_token(new_refresh),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.refresh_token_expire_minutes)
    )

    db.add(new_db_token)
    db.commit()

    new_access = create_access_token(subject=str(db_token.user_id))

    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer",
    }

@router.post("/logout")
def logout(request: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_refresh_token(request.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    jti = payload.get("jti")

    token = db.query(RefreshToken).filter(RefreshToken.jti == jti).first()

    if not token or token.revoked:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not verify_refresh_token(request.refresh_token, token.token_hash):
        raise HTTPException(status_code=401, detail="Invalid token")

    token.revoked = True
    db.commit()

    return {"message": "Logged out"}