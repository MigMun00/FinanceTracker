from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.core.deps import get_db
from app.core.auth import get_current_user
from app.models.transaction import Transaction
from app.models.category import Category
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
    end_date = date(year + 1, 1, 1) if month == 12 else date(year, month + 1, 1)

    stmt = (
        select(Transaction.type, func.sum(Transaction.amount).label("total"))
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
        "balance": income - expense,
    }


@router.get("/expenses-by-category")
def get_expenses_by_category(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(Category.name, func.sum(Transaction.amount).label("total"))
        .join(Category, Transaction.category_id == Category.id)
        .where(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
        )
        .group_by(Category.name)
        .order_by(func.sum(Transaction.amount).desc())
    )
    results = db.execute(stmt).all()
    return [{"category": name, "total": float(total)} for name, total in results]


@router.get("/cashflow")
def get_cashflow(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(
            func.extract("year", Transaction.date).label("year"),
            func.extract("month", Transaction.date).label("month"),
            Transaction.type,
            func.sum(Transaction.amount).label("total"),
        )
        .where(Transaction.user_id == current_user.id)
        .group_by("year", "month", Transaction.type)
        .order_by("year", "month")
    )
    results = db.execute(stmt).all()

    buckets: dict[tuple, dict] = {}
    for year, month, tx_type, total in results:
        key = (int(year), int(month))
        if key not in buckets:
            buckets[key] = {
                "year": int(year),
                "month": int(month),
                "income": 0.0,
                "expense": 0.0,
            }
        buckets[key][tx_type] = float(total)

    rows = sorted(buckets.values(), key=lambda r: (r["year"], r["month"]))
    for row in rows:
        row["cashflow"] = row["income"] - row["expense"]
    return rows
