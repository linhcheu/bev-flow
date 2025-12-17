# BEV Flow - Inventory Management System

A Nuxt 3 application for managing beverage inventory, suppliers, purchase orders, sales, and forecasting.

## Features

- **Dashboard**: Overview of key metrics (products, suppliers, active POs, sales, profit)
- **Products Management**: Add, edit, and view products with SKU, pricing, and profit calculations
- **Suppliers Management**: Manage supplier information and lead times
- **Purchase Orders**: Track purchase orders with status management (Pending, Shipped, Received, Cancelled)
- **Sales Tracking**: Record and view sales transactions with date filtering
- **Sales Forecasting**: Generate forecasts based on historical sales data

## Database Schema

The application is designed to work with the following MySQL database structure:

- **Suppliers**: Company details, contact info, lead times
- **Products**: SKU, pricing, descriptions, supplier relationships
- **PurchaseOrders**: PO tracking with status and dates
- **PurchaseOrderItems**: Line items for each PO
- **Sales**: Daily sales transactions
- **SalesForecasts**: Predicted sales based on historical data

## Project Structure

```
bev-flow/
├── app/
│   ├── components/        # Reusable Vue components
│   │   ├── SupplierForm.vue
│   │   ├── ProductForm.vue
│   │   └── SaleForm.vue
│   ├── layouts/          # Layout templates
│   │   └── default.vue   # Main layout with sidebar navigation
│   ├── pages/            # Route pages
│   │   ├── index.vue     # Dashboard
│   │   ├── suppliers/    # Supplier pages
│   │   ├── products/     # Product pages
│   │   ├── purchase-orders/  # PO pages
│   │   ├── sales/        # Sales pages
│   │   └── forecasts/    # Forecast pages
├── composables/          # Composable functions for state/API
│   ├── useSuppliers.ts
│   ├── useProducts.ts
│   ├── usePurchaseOrders.ts
│   ├── useSales.ts
│   └── useForecasts.ts
├── types/                # TypeScript type definitions
│   └── index.ts
├── server/               # Backend API routes
│   └── api/
│       ├── suppliers/
│       ├── products/
│       └── dashboard/
└── assets/css/           # Global styles
```

## Setup

Make sure to install dependencies:

```bash
npm install
```

2. Set up your MySQL database using the provided SQL schema

3. Configure database connection in `server/` directory (create database connection utility)

4. Update API endpoints in composables to connect to your database

5. Run development server:
```bash
npm run dev
```

## Database Connection

To connect to your MySQL database, install a MySQL client:

```bash
npm install mysql2
```

Then create a database connection utility in `server/utils/db.ts`:

```typescript
import mysql from 'mysql2/promise';

export const connectToDatabase = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'bev_flow'
  });
};
```

## API Endpoints

The application expects the following API endpoints:

- `GET /api/suppliers` - List all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

- `GET /api/purchase-orders` - List all POs
- `POST /api/purchase-orders` - Create PO
- `PUT /api/purchase-orders/:id` - Update PO
- `DELETE /api/purchase-orders/:id` - Delete PO

- `GET /api/sales` - List sales (with date filters)
- `POST /api/sales` - Record sale
- `DELETE /api/sales/:id` - Delete sale

- `GET /api/forecasts` - List forecasts
- `POST /api/forecasts/generate` - Generate forecast

- `GET /api/dashboard/stats` - Dashboard statistics

## TODO

- [ ] Implement actual database connections in API routes
- [ ] Add authentication and user management
- [ ] Implement PO item management
- [ ] Add inventory stock tracking
- [ ] Implement forecast calculation algorithm
- [ ] Add export functionality (PDF/Excel)
- [ ] Add charts and visualizations
- [ ] Implement search and filtering
- [ ] Add pagination for large datasets
- [ ] Add validation and error handling

## Production

Build the application for production:

```bash
npm run build
```
