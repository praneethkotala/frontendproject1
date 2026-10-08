# Money Matters - Project Report

## 1. Project Title
Money Matters - Frontend Financial Dashboard

## 2. Introduction
This project is a responsive personal finance and accounting web application developed using React, HTML, and CSS. It allows users to manage their personal financial transactions, monitor inflow and outflow of money, and keep track of their financial status through a dashboard interface. The application also includes role-based authentication, user profile management, and transaction operations.

## 3. Objective
The objective of this project is to build a modern and user-friendly frontend application that helps users:
- Track daily transactions
- View total credit and debit summaries
- Analyze weekly financial trends
- Add, edit, and delete transactions
- Manage a user profile
- Access the application through secure login protection

## 4. Problem Statement
Managing personal finance manually is often time-consuming and error-prone. Users require an application that provides a clear summary of their financial state and allows them to quickly update and track transactions without dealing with complex paperwork or spreadsheets.

## 5. Scope of the Project
The project includes:
- User authentication
- Protected routing
- Dashboard summaries
- Recent transactions table
- Credit and debit filtering
- Financial chart visualization
- Add, update, and delete transaction management
- Responsive frontend design

## 6. Technology Stack
- React.js
- HTML5
- CSS3
- Vite
- React Router DOM
- Recharts
- Lucide React
- Date-fns
- JS-Cookie
- Hasura Cloud REST APIs

## 7. Features
### Authentication
- Sign in with the email address and password assigned to the user's account.
- The account password is separate from the Hasura admin secret; the admin secret must never be entered in the sign-in form.
- Production account passwords are managed by the authentication backend. A fixed local demo account is available only on localhost during non-production development.
- Admin and standard user roles
- Session persistence using cookies
- Protected routes

### Dashboard
- Total credit summary card
- Total debit summary card
- Recent transactions section
- Weekly transaction chart

### Transactions
- View all transactions
- Filter credit/debit transactions
- Add new transaction
- Edit transaction details
- Delete transaction with confirmation
- Pagination control

### Profile
- User profile display
- Edit profile information
- Role label and user information display

### UI/UX
- Responsive layout
- Clean and modern interface
- Modular component design
- Loading, success, and error states

## 8. Project Structure
The project is organized into multiple folders for separation of concerns, including:
- src/pages
- src/components
- src/context
- src/services
- src/routes
- src/layout
- src/assets
- src/constants

## 9. User Profile and Backend Security
- Standard User username: `praneeth07`
- Standard User email: `kotalapraneeth07@gmail.com`
- Production account passwords are managed by the authentication backend. Local demo credentials are documented in the README and cannot be used in production.
- Store the Hasura admin secret only in the server-side environment, such as `.env.local`; never use it as an account password or expose it in browser code.
- Configure Hasura access through trusted server-side authentication or JWT role authorization; do not expose an admin secret in browser code.

## 10. Setup Instructions
To run the project locally:

```bash
cd "C:\Users\HP\OneDrive\Desktop\frontendProject"
npm install
npm run dev -- --host 0.0.0.0
```

Then open:

```text
http://localhost:5173/
```

## 11. Production Build
```bash
npm run build
```

## 12. Conclusion
Money Matters is a complete frontend financial management system focused on usability, responsiveness, and real-time transaction tracking. It demonstrates modern React-based frontend development with a clean dashboard, secure authentication flow, and efficient transaction management features.

This project provides a practical solution for users who want to monitor and manage their personal finances in a simple and effective manner.
