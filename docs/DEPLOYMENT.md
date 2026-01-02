# BEV Flow - Supabase + Vercel Deployment Guide

## 📋 Overview

This guide will help you deploy BEV Flow to **Vercel** with **Supabase** as the database.

---

## 🗄️ Step 1: Set Up Supabase

### 1.1 Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Project name**: `bev-flow`
   - **Database Password**: (save this, you'll need it!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"** and wait 2-3 minutes

### 1.2 Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `database/supabase-schema.sql`
4. Paste into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" - this is correct!

### 1.3 Get Your Database Credentials

1. Go to **Project Settings** (gear icon) → **Database**
2. Scroll to **Connection string** section
3. Copy the **URI** (starts with `postgresql://`)
4. Replace `[YOUR-PASSWORD]` with your database password

**Example:**
```
postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 1.4 Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🔧 Step 2: Update Your Code for Supabase

### 2.1 Environment Variables

Create or update `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# App Settings
NUXT_SESSION_PASSWORD=your-super-secret-session-password-min-32-chars
```

### 2.2 Install Required Package

```bash
npm install @supabase/supabase-js
```

---

## 🚀 Step 3: Deploy to Vercel

### 3.1 Push Code to GitHub

```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit - BEV Flow"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/bev-flow.git
git branch -M main
git push -u origin main
```

### 3.2 Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `bev-flow` repository
5. Configure the project:
   - **Framework Preset**: Nuxt.js
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output` (leave default)

### 3.3 Add Environment Variables

In Vercel project settings, add these environment variables:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `SUPABASE_KEY` | `eyJhbGci...` (your anon key) |
| `DATABASE_URL` | `postgresql://postgres...` (your connection string) |
| `NUXT_SESSION_PASSWORD` | Random 32+ character string |

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Your app will be live at `https://bev-flow-xxxxx.vercel.app`

---

## 🔑 Test Login Credentials

After deployment, use these to log in:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bevflow.com | admin123 |
| Manager | manager@bevflow.com | manager123 |
| Staff | staff@bevflow.com | staff123 |

---

## ⚠️ Important Notes

### Database Connection in Nuxt

Your current app uses SQLite (`better-sqlite3`). For Supabase/PostgreSQL, you need to update the database utility. Here are your options:

**Option A: Use Supabase Client (Recommended)**
- Easiest migration path
- Use `@supabase/supabase-js` for all queries
- Better security with Row Level Security (RLS)

**Option B: Use PostgreSQL directly**
- Install `pg` package: `npm install pg`
- Update `server/utils/db.ts` to use PostgreSQL
- Queries remain mostly the same (minor syntax differences)

### SQLite vs PostgreSQL Syntax Differences

| SQLite | PostgreSQL |
|--------|------------|
| `AUTOINCREMENT` | `SERIAL` |
| `INTEGER` boolean | `BOOLEAN` |
| `DATETIME` | `TIMESTAMPTZ` |
| `?` placeholder | `$1, $2, $3` placeholders |

---

## 🛠️ Troubleshooting

### Build Fails on Vercel
- Remove `better-sqlite3` from dependencies (doesn't work on serverless)
- Update `server/utils/db.ts` to use Supabase client

### Database Connection Error
- Check DATABASE_URL is correct
- Ensure password has no special characters that need encoding
- Try the "Session Mode" connection string (port 5432)

### CORS Issues
- Add your Vercel domain to Supabase allowed origins
- Project Settings → API → Add domain

---

## 📁 Files Created

- `database/supabase-schema.sql` - PostgreSQL schema for Supabase
- `docs/DEPLOYMENT.md` - This guide

---

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Nuxt Deployment Docs](https://nuxt.com/docs/getting-started/deployment)
- [Supabase + Nuxt Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nuxtjs)

---

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Run schema in SQL Editor
3. ✅ Get credentials
4. ✅ Push to GitHub
5. ✅ Deploy on Vercel
6. ⬜ Update db.ts for PostgreSQL (if needed)
7. ⬜ Set up custom domain (optional)
