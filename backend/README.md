# FinanceTracker – Backend

Backend API for a personal finance tracking application.  
Built with **FastAPI**, **SQLAlchemy 2.0**, and **Alembic**.

This backend supports:
- Multiple users
- Secure authentication (JWT)
- Categories and transactions
- Monthly financial summaries
- Ready for web and mobile frontends


## Features

- User registration and login
- JWT-based authentication
- User data isolation
- Categories CRUD
- Transactions CRUD
- Filters and pagination
- Monthly income / expense reports
- Database migrations with Alembic
- Environment-based configuration


## Tech Stack

- Python 3.14+
- FastAPI
- SQLAlchemy 2.0
- Alembic
- Pydantic v2
- SQLite (development)
- MySQL (production)
- JWT authentication


## Setup Instructions

### 1. Clone the repository
git clone <repo-url>  
cd FinanceTracker/backend


### 2. Create virtual environment
uv venv

### 3. Install dependencies
uv sync


### 4. Environment variables
Create a `.env` file in `backend/`:

APP_NAME=FinanceTracker  
DATABASE_URL=sqlite:///./finance.db  
SECRET_KEY=change-this-secret  
ALGORITHM=HS256  
ACCESS_TOKEN_EXPIRE_MINUTES=30

### 5. Run database migrations
alembic upgrade head


### 6. Run the application
uv run uvicorn app.main:app --reload

API:
- http://127.0.0.1:8000
- Docs: http://127.0.0.1:8000/docs


## Authentication Flow

1. Register user: POST /auth/register
2. Login: POST /auth/login
3. Receive JWT access token
4. Use token in Authorization header
5. Access protected endpoints


## Main API Endpoints

Auth:
- POST /auth/register
- POST /auth/login

Users:
- GET /users/me

Categories:
- POST /categories
- GET /categories
- PUT /categories/{id}
- DELETE /categories/{id}

Transactions:
- POST /transactions
- GET /transactions
- GET /transactions/{id}
- PUT /transactions/{id}
- DELETE /transactions/{id}

Filters:
- /transactions?date_from=YYYY-MM-DD
- /transactions?date_to=YYYY-MM-DD
- /transactions?category_id=1
- /transactions?tx_type=expense
- /transactions?limit=20&offset=0

Reports:
- GET /reports/monthly?year=2026&month=2


## Database Migrations

Create migration:  
alembic revision --autogenerate -m "description"

Apply migrations:  
alembic upgrade head


## Notes

- SQLite is used for development.
- Switch to MySQL by changing DATABASE_URL.
- All user data is isolated server-side.


## Future Improvements

- Budgets per category
- Savings goals
- Recurring transactions
- Charts and analytics
- React web frontend
- React Native mobile app


## License

Personal and educational use.
