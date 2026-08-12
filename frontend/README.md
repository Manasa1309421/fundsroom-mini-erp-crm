# Fundsroom Admin

Build a professional responsive admin dashboard frontend for my Fundsroom ERP + CRM project.

Tech: React + TypeScript.

Backend API base URL:

http://localhost:5000/api

Pages required:

1. Login

2. Dashboard

3. Customers

4. Products & Inventory

5. Challans

Login:

POST /auth/login

Body:

{

  "email": "...",

  "password": "..."

}

Customers:

GET /customers

POST /customers

PUT /customers/:id

DELETE /customers/:id

Products:

GET /products

POST /products

PUT /products/:id

DELETE /products/:id

Challans:

GET /challans

POST /challans

Store JWT token after login and send it as:

Authorization: Bearer <token>

Create a clean admin-style UI with sidebar navigation, tables, forms, search, loading states, error messages and responsive design.

Customer fields:

name, mobile/phone, email, business name, GST number, customer type, address, status, follow-up date, notes.

Product fields:

product name, SKU/code, category, unit price, current stock, minimum stock alert quantity, warehouse/location.

Challan fields:

challan number, customer, products, quantity, total quantity, status (Draft/Confirmed/Cancelled), created by, created date.

Show stock alerts when current stock is below minimum stock.

Make the UI professional and suitable for a full-stack developer case-study submission.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/60b66592-2607-4ae3-9112-c02ac2f40aba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
