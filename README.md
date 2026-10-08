# Money Matters - Frontend Financial Dashboard

A modern, responsive personal finance and accounting web application built with **React.js**, **HTML5**, and **CSS3**, integrated with live **Hasura Cloud REST APIs**.

---

## 🚀 Features

- **Authentication & Role-Based Access Control**:
  - Standard User profile: username `praneeth07`, email `kotalapraneeth07@gmail.com`
  - Administrator and standard-user roles
  - Session persistence via cookies and localStorage
  - Protected routes with redirect guards
- **Interactive Dashboard**:
  - Total Credit and Total Debit summary cards with live Hasura aggregation
  - Recent transactions table with category badges, formatted timestamps, and action triggers
  - Debit & Credit 7-day overview bar chart built with Recharts
- **Full Transactions Management**:
  - Tabbed filtering: **All Transactions**, **Credit**, and **Debit**
  - Paginated table with responsive controls
  - Single-responsibility Modals:
    - **Add Transaction**: Validated input for name, type, category, amount, and date
    - **Edit Transaction**: Pre-filled update modal with validation
    - **Delete Transaction**: Confirmation modal with danger state and immediate refresh
- **User Profile**:
  - Profile card with avatar, role pill, and formatted personal / address details
  - Edit Profile modal
- **Clean Architecture & Code Quality**:
  - Prepared following the **Execution Level Plan (ELP)**
  - No boolean flag arguments (split into dedicated components)
  - All magic numbers and strings extracted into `AppConstants.js`
  - Destructuring applied across all props, state, and API payloads
  - Complete handling of all API states: **Loading**, **Success**, and **Failure**

---

## 👤 User Profile

The configured Standard User profile uses username `praneeth07` and email `kotalapraneeth07@gmail.com`. Passwords and backend secrets are intentionally not stored in this repository.

---

## 🛠️ Tech Stack

- **React 19 / Vite 8**
- **React Router DOM 7**
- **Recharts**
- **Lucide React** (icons)
- **Date-fns**
- **JS-Cookie**
- **Hasura Cloud REST APIs**

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure the backend secret

Use Node.js 20.19 or newer. In PowerShell, copy `.env.example` to `.env.local`, then edit `.env.local` and replace `HASURA_ADMIN_SECRET` with a newly rotated Hasura admin secret:

```powershell
Copy-Item .env.example .env.local
notepad .env.local
```

Revoke any secret that was previously placed in frontend code. Keep the replacement server-side: do not use a `VITE_` prefix or commit `.env.local`. Optionally set `ADMIN_EMAILS` to a comma-separated allowlist of administrator email addresses.

### 3. Run Development Server
```bash
npm run dev
```
The application and its local backend will be available at `http://127.0.0.1:5173/`.

### Backend authentication

The Node backend stores Hasura credentials, verifies sign-in, issues an HttpOnly session cookie, and derives the Hasura role from the server-side administrator allowlist. Authenticated API routes are allowlisted. Never put an admin secret in frontend source or a `VITE_` environment variable, because browser bundles expose it.

### 4. Build and run for production
```bash
npm run build
npm start
```
Configure `HASURA_ADMIN_SECRET`, `HASURA_API_BASE_URL`, `ADMIN_EMAILS`, and `PORT` in the production host's server-side environment.

---

## 📝 Submission
- Submission Form: [https://forms.ccbp.in/project-submission](https://forms.ccbp.in/project-submission)
