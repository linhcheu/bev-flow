# H2O - Visual Architecture

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SIDEBAR NAVIGATION                        │  │
│  │  📊 Dashboard    🏢 Suppliers    📦 Products          │  │
│  │  📋 POs          💰 Sales        📈 Forecasts         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              MAIN CONTENT AREA                         │  │
│  │                                                         │  │
│  │  Pages:                                                │  │
│  │  • Dashboard (stats cards + quick actions)            │  │
│  │  • List pages (data tables with actions)              │  │
│  │  • Form pages (create/edit forms)                     │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📐 Component Hierarchy

```
app.vue
  └── layouts/default.vue (sidebar + main content area)
        ├── Sidebar Navigation
        │     ├── Logo
        │     └── Nav Links (Dashboard, Suppliers, Products, etc.)
        │
        └── Main Content (router-view)
              ├── pages/index.vue (Dashboard)
              │     ├── Stats Cards
              │     └── Quick Actions
              │
              ├── pages/suppliers/
              │     ├── index.vue (Table)
              │     ├── new.vue (SupplierForm)
              │     └── [id]/edit.vue (SupplierForm)
              │
              ├── pages/products/
              │     ├── index.vue (Table)
              │     ├── new.vue (ProductForm)
              │     └── [id]/edit.vue (ProductForm)
              │
              ├── pages/purchase-orders/
              │     └── index.vue (Table)
              │
              ├── pages/sales/
              │     ├── index.vue (Table + Filters)
              │     └── new.vue (SaleForm)
              │
              └── pages/forecasts/
                    └── index.vue (Table)
```

## 🔄 Data Flow Architecture

```
┌─────────────┐
│   BROWSER   │
└──────┬──────┘
       │ User Action (click, submit)
       ↓
┌─────────────┐
│    PAGE     │  (e.g., suppliers/index.vue)
└──────┬──────┘
       │ Calls composable function
       ↓
┌─────────────┐
│ COMPOSABLE  │  (e.g., useSuppliers.ts)
└──────┬──────┘
       │ Makes $fetch request
       ↓
┌─────────────┐
│  API ROUTE  │  (e.g., server/api/suppliers/index.get.ts)
└──────┬──────┘
       │ Queries database
       ↓
┌─────────────┐
│   DATABASE  │  (MySQL - Suppliers table)
└──────┬──────┘
       │ Returns data
       ↓
┌─────────────┐
│  API ROUTE  │  Formats response
└──────┬──────┘
       │ Returns JSON
       ↓
┌─────────────┐
│ COMPOSABLE  │  Updates reactive state
└──────┬──────┘
       │ State change triggers re-render
       ↓
┌─────────────┐
│    PAGE     │  Displays updated data
└──────┬──────┘
       │ Vue reactivity updates DOM
       ↓
┌─────────────┐
│   BROWSER   │  User sees result
└─────────────┘
```

## 🗂️ File Organization by Feature

### Feature: Suppliers Management

```
TYPES
  types/index.ts
    └── interface Supplier { ... }

COMPOSABLE (Logic Layer)
  composables/useSuppliers.ts
    ├── fetchSuppliers()
    ├── getSupplier(id)
    ├── createSupplier(data)
    ├── updateSupplier(id, data)
    └── deleteSupplier(id)

COMPONENTS (UI Layer)
  app/components/SupplierForm.vue
    └── Reusable form for create/edit

PAGES (Routes)
  app/pages/suppliers/
    ├── index.vue → /suppliers (list)
    ├── new.vue → /suppliers/new (create)
    └── [id]/edit.vue → /suppliers/:id/edit (edit)

API (Backend)
  server/api/suppliers/
    ├── index.get.ts → GET /api/suppliers
    ├── index.post.ts → POST /api/suppliers (TODO)
    ├── [id].get.ts → GET /api/suppliers/:id (TODO)
    ├── [id].put.ts → PUT /api/suppliers/:id (TODO)
    └── [id].delete.ts → DELETE /api/suppliers/:id (TODO)

DATABASE
  database/schema.sql
    └── CREATE TABLE Suppliers { ... }
```

## 🎨 UI Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│  H2O                                    [User Menu]    │ Header
├──────────┬─────────────────────────────────────────────────┤
│          │                                                  │
│  📊 Dash │  ┌────────────────────────────────────────┐    │
│  🏢 Supp │  │         PAGE CONTENT                   │    │
│  📦 Prod │  │                                         │    │
│  📋 POs  │  │  • Dashboard: Stats + Actions          │    │
│  💰 Sale │  │  • List Pages: Tables + Buttons        │    │
│  📈 Fore │  │  • Form Pages: Input Fields + Submit   │    │
│          │  │                                         │    │
│  Sidebar │  │                                         │    │
│  250px   │  └────────────────────────────────────────┘    │
│  Fixed   │              Main Content Area                  │
│          │              (Scrollable)                       │
│          │                                                  │
└──────────┴─────────────────────────────────────────────────┘
```

## 📊 Database Relationships

```
┌─────────────┐
│  Suppliers  │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────┴──────┐         ┌──────────────────┐
│  Products   │─────────│ PurchaseOrderItems│
└──────┬──────┘    N    └────────┬─────────┘
       │                          │ N
       │ N                        │
       │                          │ 1
       │                 ┌────────┴─────────┐
       │                 │  PurchaseOrders  │
       │                 └────────┬─────────┘
       │ 1                        │ N
       │                          │
┌──────┴──────┐                   │
│    Sales    │                   │
└──────┬──────┘            ┌──────┴──────┐
       │ N                 │  Suppliers  │
       │                   └─────────────┘
       │ 1
┌──────┴───────┐
│  Products    │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────┴───────────┐
│ SalesForecasts   │
└──────────────────┘
```

## 🚦 Page-to-Page Navigation Flow

```
Dashboard (/)
  ├─→ Add Product → /products/new → [Save] → /products
  ├─→ Add Supplier → /suppliers/new → [Save] → /suppliers
  ├─→ Create PO → /purchase-orders/new → [Save] → /purchase-orders
  └─→ Record Sale → /sales/new → [Save] → /sales

Suppliers (/suppliers)
  ├─→ Add New → /suppliers/new
  └─→ Edit → /suppliers/:id/edit → [Save] → /suppliers

Products (/products)
  ├─→ Add New → /products/new
  └─→ Edit → /products/:id/edit → [Save] → /products

Purchase Orders (/purchase-orders)
  ├─→ Create PO → /purchase-orders/new (TODO)
  ├─→ View PO → /purchase-orders/:id (TODO)
  └─→ Edit PO → /purchase-orders/:id/edit (TODO)

Sales (/sales)
  └─→ Record Sale → /sales/new → [Save] → /sales

Forecasts (/forecasts)
  └─→ Generate → /forecasts/generate (TODO)
```

## 🎯 State Management Flow

```
┌──────────────────────────────────────────────────────────┐
│                    COMPOSABLES                            │
│  (Centralized State & Logic)                             │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  useSuppliers()                                          │
│    ├── suppliers: Ref<Supplier[]>     (reactive state)  │
│    ├── loading: Ref<boolean>                             │
│    ├── error: Ref<string | null>                        │
│    └── methods: fetchSuppliers(), createSupplier()...   │
│                                                           │
│  useProducts()                                           │
│    ├── products: Ref<Product[]>                         │
│    └── methods...                                        │
│                                                           │
│  usePurchaseOrders()                                     │
│    ├── purchaseOrders: Ref<PurchaseOrder[]>            │
│    └── methods...                                        │
│                                                           │
└──────────────────────────────────────────────────────────┘
                           ↑
                           │ Shared across all components
                           ↓
┌──────────────────────────────────────────────────────────┐
│                   COMPONENTS/PAGES                        │
│  (Import and use composables)                            │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  suppliers/index.vue                                     │
│    const { suppliers, fetchSuppliers } = useSuppliers() │
│                                                           │
│  suppliers/new.vue                                       │
│    const { createSupplier } = useSuppliers()            │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## 📝 Form Submission Flow

```
User fills form
      ↓
Clicks Submit button
      ↓
Form validation (HTML5)
      ↓
@submit.prevent triggered
      ↓
Component method called
      ↓
Composable method called (e.g., createSupplier())
      ↓
loading.value = true
      ↓
$fetch() makes API request
      ↓
API endpoint receives data
      ↓
Database INSERT query
      ↓
Return new record
      ↓
Update reactive state
      ↓
loading.value = false
      ↓
Navigate to list page (router.push())
      ↓
User sees updated list
```

## 🎨 Styling Architecture

```
Global Styles (assets/css/main.css)
  └── Base styles, resets, typography

Component Styles (scoped)
  ├── Layout (layouts/default.vue)
  │     ├── Sidebar styling
  │     └── Main content area
  │
  ├── Pages
  │     ├── Table styling
  │     ├── Card styling
  │     └── Button styling
  │
  └── Components
        └── Form styling

Color Scheme:
  Primary: #3b82f6 (blue)
  Success: #059669 (green)
  Danger: #dc2626 (red)
  Gray: #6b7280
  Background: #f3f4f6
```

---

**This visual guide should help you understand how all the pieces fit together!**
