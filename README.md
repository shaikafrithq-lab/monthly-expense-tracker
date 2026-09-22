# Monthly Expense Tracker

A full-stack web application for managing monthly income and expenses.

The application allows users to record their income and expenses, track their spending, view category-wise expenses, and monitor their remaining balance and savings.

## Features

- User login and authentication
- JWT-based authentication
- Add new expenses
- Edit existing expenses
- Delete expenses
- Set monthly income
- Monthly expense tracking
- Category-wise expense breakdown
- Expense search
- Total expense calculation
- Remaining balance calculation
- Savings percentage
- Highest spending category
- Expense visualization using charts
- Data stored using Django REST API

## Tech Stack

### Frontend
- React
- JavaScript
- Vite
- Recharts
- HTML
- CSS

### Backend
- Python
- Django
- Django REST Framework
- Simple JWT

### Database
- SQLite

### Tools
- Git
- GitHub
- VS Code

## Project Structure

```text
monthly_expense_tracker/
│
├── backend/
│   ├── config/
│   ├── expenses/
│   └── manage.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md