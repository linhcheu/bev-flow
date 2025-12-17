# BEV Flow - File Structure Reference

## Complete Project Structure

```
bev-flow/
├── .env.example                    # Environment variables template
├── README.md                       # Project documentation
├── nuxt.config.ts                  # Nuxt configuration
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
│
├── app/
│   ├── app.vue                     # Root component
│   ├── components/                 # Reusable Vue components
│   │   ├── SupplierForm.vue       # Form for creating/editing suppliers
│   │   ├── ProductForm.vue        # Form for creating/editing products
│   │   └── SaleForm.vue           # Form for recording sales
│   │
│   ├── layouts/
│   │   └── default.vue            # Main layout with sidebar navigation
│   │
│   ├── pages/                     # Auto-routed pages
│   │   ├── index.vue              # Dashboard (/)
│   │   ├── login.vue              # Login page
│   │   ├── signup.vue             # Signup page
│   │   │
│   │   ├── suppliers/
│   │   │   ├── index.vue          # Suppliers list (/suppliers)
│   │   │   ├── new.vue            # Create supplier (/suppliers/new)
│   │   │   └── [id]/
│   │   │       └── edit.vue       # Edit supplier (/suppliers/:id/edit)
│   │   │
│   │   ├── products/
│   │   │   ├── index.vue          # Products list (/products)
│   │   │   ├── new.vue            # Create product (/products/new)
│   │   │   └── [id]/
│   │   │       └── edit.vue       # Edit product (/products/:id/edit)
│   │   │
│   │   ├── purchase-orders/
│   │   │   ├── index.vue          # PO list (/purchase-orders)
│   │   │   ├── new.vue            # Create PO (TODO)
│   │   │   └── [id]/
│   │   │       ├── index.vue      # View PO (TODO)
│   │   │       └── edit.vue       # Edit PO (TODO)
│   │   │
│   │   ├── sales/
│   │   │   ├── index.vue          # Sales list (/sales)
│   │   │   └── new.vue            # Record sale (/sales/new)
│   │   │
│   │   └── forecasts/
│   │       ├── index.vue          # Forecasts list (/forecasts)
│   │       └── generate.vue       # Generate forecast (TODO)
│   │
│   └── middleware/                # Route middleware (empty for now)
│
├── assets/
│   └── css/
│       └── main.css               # Global styles
│
├── composables/                   # Reusable composition functions
│   ├── useSuppliers.ts           # Supplier CRUD operations
│   ├── useProducts.ts            # Product CRUD operations
│   ├── usePurchaseOrders.ts      # PO CRUD operations
│   ├── useSales.ts               # Sales CRUD operations
│   └── useForecasts.ts           # Forecast operations
│
├── types/
│   └── index.ts                  # TypeScript type definitions
│
├── server/                       # Backend API
│   ├── api/
│   │   ├── suppliers/
│   │   │   └── index.get.ts     # GET /api/suppliers
│   │   ├── products/
│   │   │   └── index.get.ts     # GET /api/products
│   │   └── dashboard/
│   │       └── stats.get.ts     # GET /api/dashboard/stats
│   │
│   └── utils/
│       └── db.ts                # Database connection utility
│
├── database/
│   └── schema.sql               # MySQL database schema
│
└── public/
    └── robots.txt

```

## Key Files Explained

### Type Definitions (`types/index.ts`)
Contains TypeScript interfaces for:
- Supplier
- Product
- PurchaseOrder
- PurchaseOrderItem
- Sale
- SalesForecast
- DashboardStats

### Composables
Each composable provides:
- State management (ref for data, loading, error)
- CRUD operations (fetch, get, create, update, delete)
- API integration

### Pages
- **index.vue**: Dashboard with statistics and quick actions
- **suppliers/index.vue**: List all suppliers with edit/delete
- **suppliers/new.vue**: Create new supplier
- **suppliers/[id]/edit.vue**: Edit existing supplier
- **products/index.vue**: List all products with profit calculation
- **products/new.vue**: Create new product
- **products/[id]/edit.vue**: Edit existing product
- **purchase-orders/index.vue**: List all POs with status badges
- **sales/index.vue**: List sales with date filtering
- **sales/new.vue**: Record new sale
- **forecasts/index.vue**: List sales forecasts

### Components
- **SupplierForm.vue**: Reusable form for supplier create/edit
- **ProductForm.vue**: Reusable form for product create/edit with profit preview
- **SaleForm.vue**: Form for recording sales with auto-calculation

### Layout
- **default.vue**: Sidebar navigation with links to all major sections

### API Routes (Server)
Currently mock data. TODO: Implement actual database queries.
- GET /api/suppliers
- GET /api/products
- GET /api/dashboard/stats

## Route Structure

```
/ ........................... Dashboard
/login ...................... Login page
/signup ..................... Signup page
/suppliers .................. Suppliers list
/suppliers/new .............. Create supplier
/suppliers/:id/edit ......... Edit supplier
/products ................... Products list
/products/new ............... Create product
/products/:id/edit .......... Edit product
/purchase-orders ............ PO list
/purchase-orders/new ........ Create PO (TODO)
/purchase-orders/:id ........ View PO (TODO)
/purchase-orders/:id/edit ... Edit PO (TODO)
/sales ...................... Sales list
/sales/new .................. Record sale
/forecasts .................. Forecasts list
/forecasts/generate ......... Generate forecast (TODO)
```

## Next Steps

1. **Database Setup**
   - Run `database/schema.sql` in MySQL
   - Copy `.env.example` to `.env` and configure
   - Install mysql2: `npm install mysql2`
   - Uncomment database code in `server/utils/db.ts`

2. **Implement Missing API Endpoints**
   - POST /api/suppliers
   - PUT /api/suppliers/:id
   - DELETE /api/suppliers/:id
   - Similar endpoints for products, POs, sales, forecasts

3. **Add Missing Features**
   - Purchase order item management
   - Forecast generation algorithm
   - Authentication/authorization
   - Stock tracking
   - Reports and analytics

4. **Enhance UI**
   - Add loading states and animations
   - Implement toast notifications
   - Add confirmation modals
   - Improve responsive design
   - Add data visualization charts
