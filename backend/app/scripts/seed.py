import random
from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.database import engine  # adjust if needed
from app.models.transaction import Transaction
from app.models.category import Category

USER_ID = 1

# --- Config ---
NUM_TRANSACTIONS = 200

CATEGORY_NAMES = [
    "Salary",
    "Food",
    "Groceries",
    "Transport",
    "Entertainment",
    "Utilities",
    "Health",
    "Shopping",
]

INCOME_CATEGORIES = {"Salary"}
EXPENSE_CATEGORIES = set(CATEGORY_NAMES) - INCOME_CATEGORIES


def random_date():
    today = date.today()
    start = today - timedelta(days=180)
    return start + timedelta(days=random.randint(0, 180))


def seed():
    with Session(engine) as session:
        # --- Create categories ---
        categories = []
        for name in CATEGORY_NAMES:
            category = Category(name=name, user_id=USER_ID)
            session.add(category)
            categories.append(category)

        session.commit()

        # Refresh to get IDs
        for c in categories:
            session.refresh(c)

        # Split categories
        income_cats = [c for c in categories if c.name in INCOME_CATEGORIES]
        expense_cats = [c for c in categories if c.name in EXPENSE_CATEGORIES]

        # --- Create transactions ---
        transactions = []

        for _ in range(NUM_TRANSACTIONS):
            if random.random() < 0.2:
                # Income
                category = random.choice(income_cats)
                amount = round(random.uniform(1000, 5000), 2)
                t_type = "income"
                description = "Monthly salary"
            else:
                # Expense
                category = random.choice(expense_cats)
                amount = round(random.uniform(50, 800), 2)
                t_type = "expense"
                description = category.name

            transaction = Transaction(
                amount=Decimal(str(amount)),
                type=t_type,
                date=random_date(),
                description=description,
                user_id=USER_ID,
                category_id=category.id,
            )

            transactions.append(transaction)

        session.add_all(transactions)
        session.commit()

        print(f"Seeded {len(categories)} categories and {len(transactions)} transactions")


if __name__ == "__main__":
    seed()