# Smart Inventory & Billing Management System

A full-stack, enterprise-grade retail inventory control, Point of Sale (POS), and billing management web application designed for modern business operations and internship project presentations.

---

## 🌟 Tech Stack Architecture

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (Modern light theme with subtle indigo accents, rounded cards, and restrained shadows)
- **Routing**: React Router v7 (Protected & Public route guards)
- **State & Context**: React Context API (`AuthContext`)
- **HTTP Client**: Axios with automatic JWT interceptors
- **Icons**: Lucide React
- **Analytics & Charts**: Recharts (Interactive area revenue charts)
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: Feature-Based Modular Architecture with native **ES Modules (`import`/`export`)**
- **Database**: Cloud MySQL (Aiven MySQL with SSL encryption)
- **Authentication**: Stateless JSON Web Tokens (JWT) & bcryptjs salted password hashing
- **Transactions**: Atomic ACID MySQL Transactions for checkout and stock deduction

---

## 📁 Project Structure

```
smart-inventory-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MySQL connection pool with SSL
│   │   │   ├── env.js                # Environment config loader
│   │   │   ├── initDb.js             # Automated schema runner
│   │   │   └── schema.sql            # 6-table database DDL
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT bearer token verification
│   │   │   ├── roleMiddleware.js     # Role-based access control (Admin / Staff)
│   │   │   ├── errorMiddleware.js    # Global error response handler
│   │   │   └── notFoundMiddleware.js # Fallback 404 handler
│   │   ├── utils/
│   │   │   ├── ApiError.js           # Custom error class
│   │   │   ├── generateInvoice.js    # e.g., INV-2026-4821
│   │   │   └── generateToken.js      # JWT generator
│   │   ├── modules/
│   │   │   ├── auth/                 # Register, Login, Me, Logout
│   │   │   ├── users/                # User management & role assignment
│   │   │   ├── categories/           # Category CRUD
│   │   │   ├── products/             # Product catalog, SKU, pricing, low-stock threshold
│   │   │   ├── inventory/            # Warehouse stock adjustment (add/subtract/set)
│   │   │   ├── customers/            # Customer directory & purchase history
│   │   │   ├── billing/              # POS checkout with atomic transactions
│   │   │   ├── sales/                # Sales invoices archive & printable receipt
│   │   │   └── dashboard/            # Real-time KPIs, charts, and alert metrics
│   │   ├── app.js                    # Express app configuration & route mounting
│   │   └── server.js                 # Server entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Button, Input, Modal, Loader, EmptyState, ConfirmDialog
│   │   │   └── layout/               # Sidebar, Topbar, DashboardLayout
│   │   ├── pages/
│   │   │   ├── auth/                 # Login, Register
│   │   │   ├── dashboard/            # Business Overview & Recharts
│   │   │   ├── products/             # Catalog management & filter
│   │   │   ├── categories/           # Category management
│   │   │   ├── inventory/            # Warehouse stock adjustment
│   │   │   ├── customers/            # Customer records & history
│   │   │   ├── billing/              # Point of Sale & Printable Receipt
│   │   │   └── sales/                # Sales invoice archive
│   │   ├── context/                  # AuthContext
│   │   ├── hooks/                    # useAuth
│   │   ├── services/                 # Axios API service layer
│   │   ├── routes/                   # AppRoutes with ProtectedRoute guard
│   │   └── utils/                    # formatCurrency (INR), formatDate
│   └── package.json
└── package.json
```

---

## 🚀 How to Run the Application

### 1. Start the Backend Server
In a terminal:
```powershell
cd f:\react\smart-inventory-system\backend
npm run dev
```
The backend starts on `http://localhost:5000`.

### 2. Start the Frontend Application
In a second terminal:
```powershell
cd f:\react\smart-inventory-system\frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Key Features

1. **Secure Authentication & Roles**:
   - Passwords hashed with `bcryptjs`.
   - JWT tokens stored securely and attached to all API requests.
   - Staff vs. Admin role-based access.

2. **Real-time Point of Sale (POS)**:
   - Instant search and SKU scan.
   - Live interactive cart with quantity increments and decrements.
   - Customer linking or walk-in purchases.
   - Tax and discount calculations.
   - Multiple payment options (Cash, UPI, Card).

3. **Atomic Stock Deduction**:
   - Powered by ACID MySQL transactions (`BEGIN TRANSACTION`, `COMMIT`, `ROLLBACK`).
   - Guarantees zero stock discrepancies during checkout.

4. **Printable Invoices**:
   - Clean, professional receipts ready for browser printing or PDF saving.

5. **Inventory Valuation & Alerts**:
   - Real-time stock alerts for items below warning thresholds.
   - Restock (+), Damage (-), and Audit (=) stock adjustments.

