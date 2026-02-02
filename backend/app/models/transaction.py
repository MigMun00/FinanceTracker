from datetime import date

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, Numeric, String, Date, ForeignKey, CheckConstraint

from app.models.base import Base

class Transaction(Base):
    __tablename__ = "transactions"
    __table_args__ = (
        CheckConstraint("amount > 0", name="ck_amount_positive"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    amount: Mapped[float] = mapped_column(Numeric(10, 2))
    type: Mapped[str] = mapped_column(String(10))
    date: Mapped[date] = mapped_column(Date)
    description: Mapped[str | None] = mapped_column(String(255))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id"))