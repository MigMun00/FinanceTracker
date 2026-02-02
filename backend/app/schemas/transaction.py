from pydantic import BaseModel
from datetime import date as date_
from decimal import Decimal
from typing import Optional

class TransactionBase(BaseModel):
    amount: Decimal
    type: str  # income | expense
    date: date_
    category_id: int
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionRead(TransactionBase):
    id: int

    class Config:
        from_attributes = True

class TransactionUpdate(BaseModel):
    amount: Optional[Decimal] = None
    type: Optional[str] = None
    date: Optional[date_] = None
    category_id: Optional[int] = None
    description: Optional[str] = None