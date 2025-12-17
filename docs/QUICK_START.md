# BEV Flow - Quick Start Guide

## What's Been Created

A complete Nuxt 3 inventory management system with:

✅ **18 Vue Components/Pages**
- Dashboard with stats
- Supplier management (list, create, edit)
- Product management (list, create, edit)
- Purchase orders (list view)
- Sales tracking (list, create)
- Forecasts (list view)

✅ **5 Composables** for data management
- useSuppliers, useProducts, usePurchaseOrders, useSales, useForecasts

✅ **Type Definitions** matching your database schema

✅ **API Structure** (mock data, ready for database connection)

✅ **Database Schema** (schema.sql file)

✅ **Sidebar Navigation Layout**

## Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

## Current State

The application is **fully functional with mock data**. All pages and navigation work, but the data is not yet persisted to a database.

### Working Features:
- ✅ Dashboard displays stats
- ✅ Navigate between all pages
- ✅ Forms render correctly
- ✅ Tables display mock data
- ✅ Responsive sidebar navigation
- ✅ Status badges for purchase orders
- ✅ Profit calculations for products
- ✅ Date filtering for sales

### Not Yet Implemented:
- ❌ Actual database connection (still using mock data)
- ❌ Create/Update/Delete operations (API endpoints needed)
- ❌ Purchase order item management
- ❌ Forecast generation algorithm
- ❌ Authentication/authorization
- ❌ Stock inventory tracking

## Next Steps to Connect Database

### Step 1: Install MySQL Driver
```bash
npm install mysql2
```

### Step 2: Set Up Database
```bash
# In MySQL, create database
CREATE DATABASE bev_flow;

# Import schema
mysql -u root -p bev_flow < database/schema.sql
```

### Step 3: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
```

### Step 4: Enable Database Connection
Uncomment the code in `server/utils/db.ts`

### Step 5: Implement API Endpoints

Create the following endpoints in `server/api/`:

**Suppliers:**
- `suppliers/index.get.ts` ✅ (already exists)
- `suppliers/index.post.ts` (create)
- `suppliers/[id].put.ts` (update)
- `suppliers/[id].delete.ts` (delete)

**Products:**
- `products/index.get.ts` ✅ (already exists)
- `products/index.post.ts` (create)
- `products/[id].get.ts` (get one)
- `products/[id].put.ts` (update)
- `products/[id].delete.ts` (delete)

**Purchase Orders:**
- `purchase-orders/index.get.ts` (list)
- `purchase-orders/index.post.ts` (create)
- `purchase-orders/[id].get.ts` (get one)
- `purchase-orders/[id].put.ts` (update)
- `purchase-orders/[id].delete.ts` (delete)

**Sales:**
- `sales/index.get.ts` (list with filters)
- `sales/index.post.ts` (create)
- `sales/[id].delete.ts` (delete)

**Forecasts:**
- `forecasts/index.get.ts` (list)
- `forecasts/generate.post.ts` (generate)

### Example API Endpoint Implementation

Here's how to implement a real API endpoint:

**File: `server/api/suppliers/index.post.ts`**
```typescript
import { query } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const result = await query(
    `INSERT INTO Suppliers (company_name, contact_person, phone, email, address, lead_time_days)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      body.company_name,
      body.contact_person,
      body.phone,
      body.email,
      body.address,
      body.lead_time_days || 7
    ]
  );
  
  return {
    supplier_id: result.insertId,
    ...body
  };
});
```

## Project Structure Overview

```
bev-flow/
├── app/
│   ├── components/      # Reusable forms
│   ├── layouts/         # Navigation layout
│   └── pages/          # All routes
├── composables/        # API logic & state
├── types/             # TypeScript interfaces
├── server/
│   ├── api/           # Backend endpoints
│   └── utils/         # Database connection
├── database/          # SQL schema
└── docs/             # Documentation
```

## Testing the Application

1. **Dashboard**: Visit `/` to see stats overview
2. **Suppliers**: 
   - View list: `/suppliers`
   - Add new: `/suppliers/new`
3. **Products**: 
   - View list: `/products`
   - Add new: `/products/new`
4. **Purchase Orders**: View list: `/purchase-orders`
5. **Sales**: 
   - View list: `/sales`
   - Record sale: `/sales/new`
6. **Forecasts**: View list: `/forecasts`

## Customization

### Change Colors
Edit the color values in component `<style>` sections:
- Primary: `#3b82f6` (blue)
- Success: `#059669` (green)
- Danger: `#dc2626` (red)

### Add New Pages
1. Create file in `app/pages/`
2. Nuxt auto-generates the route
3. Add link in `app/layouts/default.vue`

### Add New Fields
1. Update types in `types/index.ts`
2. Update forms in `app/components/`
3. Update database schema in `database/schema.sql`
4. Update API queries

## Common Issues

**Issue**: Pages not loading
**Solution**: Make sure dev server is running: `npm run dev`

**Issue**: Navigation not working
**Solution**: Make sure layout is applied (Nuxt does this automatically)

**Issue**: TypeScript errors
**Solution**: Run `npm run build` to check for type errors

**Issue**: API endpoints not found
**Solution**: Check that files are in `server/api/` directory

## Getting Help

- Check `README.md` for detailed documentation
- See `docs/FILE_STRUCTURE.md` for complete file reference
- Review `database/schema.sql` for database structure

## Production Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

For deployment, see: https://nuxt.com/docs/getting-started/deployment
