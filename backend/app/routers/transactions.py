from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.deps import get_db
from app.core.auth import get_current_user
from app.models.transaction import Transaction
from app.models.category import Category
from app.models.user import User
from app.schemas.transaction import TransactionCreate, TransactionRead, TransactionUpdate

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
def create_transaction(
        data: TransactionCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    category = db.scalar(
        select(Category).where(
            Category.id == data.category_id,
            Category.user_id == current_user.id
        )
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category"
        )

    tx = Transaction(
        **data.model_dump(),
        user_id=current_user.id
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx

@router.get("", response_model=list[TransactionRead])
def get_transactions_list(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    stmt = select(Transaction).where(Transaction.user_id == current_user.id)
    return db.scalars(stmt).all()

@router.get("/{transaction_id}", response_model=TransactionRead)
def get_transaction(
        transaction_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    tx = db.scalar(
        select(Transaction).where(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id
        )
    )
    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    return tx

@router.put("/{transaction_id}", response_model=TransactionRead)
def update_transaction(
        transaction_id: int,
        data: TransactionUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    tx = db.scalar(
        select(Transaction).where(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id
        )
    )
    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

    if data.category_id is not None:
        category = db.scalar(
            select(Category).where(
                Category.id == data.category_id,
                Category.user_id == current_user.id
            )
        )
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid category"
            )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(tx, field, value)

    db.commit()
    db.refresh(tx)
    return tx

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction_by_id(
        transaction_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    tx = db.scalar(
        select(Transaction).where(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id
        )
    )
    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

    db.delete(tx)
    db.commit()