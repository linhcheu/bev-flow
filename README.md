# BEV Flow - Beverage Inventory Management System

A modern, full-featured inventory management system designed for beverage distributors, retailers, and karaoke businesses.

**Live Demo**: [Your Vercel URL here]

---

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bevflow.com | admin123 |
| Manager | manager@bevflow.com | manager123 |
| Staff | staff@bevflow.com | staff123 |

---

## ✨ Features

### 📊 Dashboard
- Real-time sales overview with daily statistics
- Low stock alerts (items below minimum level)
- Sales trend charts and analytics
- Top selling products ranking
- Quick navigation to all sections
- **Export to PDF** - Generate comprehensive dashboard reports

### 📦 Products Management
- View all products with stock levels, pricing, and profit margins
- Add new products with SKU, cost/selling prices, and supplier assignment
- Edit and update product details
- Delete products with confirmation
- **View Detail Modal** - Quick view of product information
- **Export to Excel/PDF** - Individual product detail export
- Search, filter by stock status/supplier, and pagination
- Stock level color indicators (green/amber/red)

### 🏢 Suppliers Management
- Complete supplier information management
- Track contact details, sales agents, and lead times
- Products supplied tracking
- **View Detail Modal** - Full supplier profile view
- **Export to Excel/PDF** - Individual supplier profile export
- Search and pagination

### 📋 Purchase Orders
- Create purchase orders with auto-generated PO numbers
- Multi-item orders with product selection
- Track order status (Pending, Ordered, Shipped, Received, Cancelled)
- Calculate totals with subtotal, shipping, and promotions
- Third-party agent information tracking
- **View Detail Modal** - Full PO with items breakdown
- **Export to Excel/PDF** - Professional PO document export
- Date range filtering and supplier filtering

### 💰 Sales Recording
- Record sales transactions with auto-generated invoice numbers
- **Multi-item invoices** - Add multiple products to a single sale (like how customers buy 2+ different items)
- Track sales by product and customer
- Real-time stock level display for each product
- Calculate subtotals and totals automatically
- **Edit Sales** - Modify existing sale records with multi-item support
- **View Detail Modal** - Invoice-style sale view with all items
- **Export as Invoice PDF** - Professional invoice with branding header
- **Export as Invoice Excel** - Spreadsheet format export
- Date range filtering and product filtering
- Sales summary statistics (total sales, transactions, items sold, avg sale)

### 📈 Analytics Dashboard
- Revenue overview with interactive charts
- Monthly sales trends visualization
- Inventory health status monitoring
- Purchase order status breakdown
- Category distribution analysis
- **Export to Excel/PDF** - Analytics summary report

### 🔮 Sales Forecasts
- AI-powered sales predictions for inventory planning
- Confidence score indicators
- Restock recommendations
- **View Detail Modal** - Forecast details with AI recommendation
- **Export to Excel/PDF** - Individual forecast detail export
- Filter by period and confidence level

### 👤 Profile Management
- View and edit profile information (name, phone, location)
- Email display (read-only for security)
- Change password with current password validation
- Role-based access display

### 🎨 User Interface
- Clean, minimalist design
- Fully responsive (mobile, tablet, desktop)
- Dark/light theme toggle
- Real user data in sidebar (fetched from profile)
- Smooth animations and transitions
- Toast notifications for actions

---

## 📤 Export Capabilities

Every data page includes comprehensive export options:

| Page | Excel | PDF | Individual Export |
|------|-------|-----|-------------------|
| Dashboard | - | ✅ Summary Report | - |
| Products | ✅ | ✅ | ✅ PDF & Excel (Detail Sheet) |
| Suppliers | ✅ | ✅ | ✅ PDF & Excel (Profile Sheet) |
| Sales | ✅ | ✅ | ✅ PDF & Excel (Invoice) |
| Purchase Orders | ✅ | ✅ | ✅ PDF & Excel (PO Document) |
| Forecasts | ✅ | ✅ | ✅ PDF & Excel (Forecast Report) |
| Analytics | ✅ | ✅ | - |

**Export Features:**
- Professional PDF layouts with BEV Flow logo/branding header
- Multi-item invoice support for sales exports
- Excel exports with formatted cells and proper column widths
- One-click export from list views and detail modals

---

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + Nuxt 3
- **UI Components**: Nuxt UI
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Export**: xlsx, jsPDF, jspdf-autotable
- **Icons**: Lucide Icons
- **Animations**: @vueuse/motion

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bev-flow.git
cd bev-flow

# Install dependencies
npm install

# Initialize the database
npm run db:init

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
bev-flow/
├── app/
│   ├── components/     # Reusable Vue components
│   ├── composables/    # Vue composables (useSales, useProducts, useExport, etc.)
│   ├── layouts/        # Page layouts (default, auth)
│   ├── pages/          # Route pages
│   └── utils/          # Utility functions
├── server/
│   ├── api/            # API endpoints
│   └── utils/          # Server utilities (db)
├── database/           # Database schema
├── types/              # TypeScript type definitions
└── public/             # Static assets
```

---

## 🔒 Security Notes

- Passwords are hashed using bcrypt
- Session-based authentication
- Protected API routes
- Input validation on all forms

---

## 📝 License

MIT License - feel free to use this project for your own purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ for beverage inventory management
