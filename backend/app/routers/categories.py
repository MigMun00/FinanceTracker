from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.deps import get_db
from app.core.auth import get_current_user
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(
        data: CategoryCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    category = Category(
        name=data.name,
        user_id=current_user.id
    )
    db.add(category)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )
    db.refresh(category)
    return category

@router.get("", response_model=list[CategoryRead])
def get_categories_list(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    stmt = select(Category).where(Category.user_id == current_user.id)
    return db.scalars(stmt).all()

@router.put("/{category_id}", response_model=CategoryRead)
def update_category_by_id(
        category_id: int,
        data: CategoryUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    category = db.scalar(
        select(Category).where(
            Category.id == category_id,
            Category.user_id == current_user.id
        )
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    category.name = data.name
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )
    db.refresh(category)
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category_by_id(
        category_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    category = db.scalar(
        select(Category).where(
            Category.id == category_id,
            Category.user_id == current_user.id
        )
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    db.delete(category)
    db.commit()