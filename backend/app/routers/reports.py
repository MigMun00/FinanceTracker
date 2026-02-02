from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.core.deps import get_db
from app.core.auth import get_current_user
from app.models.transaction import Transaction
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/monthly")
def get_monthly_summary(
        year: int,
        month: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    start_date = date(year, month, 1)
    end_date = (
        date(year + 1, 1, 1)
        if month == 12
        else date(year, month + 1, 1)
    )

    stmt = (
        select(Transaction.type,
               func.sum(Transaction.amount).label("total")
        )
        .where(
            Transaction.user_id == current_user.id,
            Transaction.date >= start_date,
            Transaction.date < end_date,
        )
        .group_by(Transaction.type)
    )

    results = db.execute(stmt).all()

    income = 0
    expense = 0

    for tx_type, total in results:
        if tx_type == "income":
            income = total
        elif tx_type == "expense":
            expense = total

    return {
        "year": year,
        "month": month,
        "income": income,
        "expense": expense,
        "balance": income - expense
    }