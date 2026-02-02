from pydantic import BaseModel
# noinspection PyPep8Naming
from datetime import date as DateType
from decimal import Decimal
from typing import Optional

class TransactionBase(BaseModel):
    amount: Decimal
    type: str  # income | expense
    date: DateType
    category_id: int
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionRead(TransactionBase):
    id: int

class TransactionUpdate(BaseModel):
    amount: Optional[Decimal] = None
    type: Optional[str] = None
    date: Optional[DateType] = None
    category_id: Optional[int] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True