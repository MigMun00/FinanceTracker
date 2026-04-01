from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "first_name": current_user.first_name, "last_name": current_user.last_name}