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

### 2. Run Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:5173/`.

### Backend authentication

The frontend does not contain a Hasura admin secret. Configure Hasura authentication through a trusted server-side API or JWT-based role authorization before using the live API. Never put an admin secret in frontend source or a `VITE_` environment variable, because browser bundles expose it.

### 3. Build for Production
```bash
npm run build
```

---

## 📝 Submission
- Submission Form: [https://forms.ccbp.in/project-submission](https://forms.ccbp.in/project-submission)
