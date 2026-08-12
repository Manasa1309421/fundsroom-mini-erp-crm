# Fundsroom Mini ERP + CRM

A full-stack Mini ERP + CRM Operations Portal developed for a wholesale/distribution business.

## Features

### Authentication & Roles
- JWT-based login
- Admin
- Sales
- Warehouse
- Accounts
- Role-based access

### Customer CRM
- Add customer
- Edit customer
- Search customers
- View customer details
- Follow-up notes
- Customer status management

### Product & Inventory
- Add product
- Edit product
- Product SKU
- Category
- Unit price
- Current stock
- Minimum stock level
- Warehouse/location
- Low-stock alerts
- Stock movement tracking

### Sales Challan
- Select customer
- Add multiple products
- Add product quantities
- Automatic challan number
- Draft / Confirmed / Cancelled status
- Stock reduction after confirmation
- Stock validation

## Tech Stack

### Frontend
- React
- TypeScript
- HTML
- CSS
- Responsive UI

### Backend
- Node.js
- TypeScript
- Express.js
- REST APIs
- JWT Authentication

### Database
- Supabase PostgreSQL

## API

Example endpoints:

- `POST /api/auth/login`
- `GET /api/customers`
- `GET /api/products`
- `GET /api/challans`

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev