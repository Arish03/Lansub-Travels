# 🚌 Lansub Travel OS (National Travels)

> **Next-Generation Bus Fleet & Travel Operations Management Platform**  
> A comprehensive, full-stack enterprise Operating System engineered for intercity bus operators, fleet managers, and ticketing command centers.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features & Modules](#-key-features--modules)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Quick Start & Setup](#-quick-start--setup)
- [Demo Credentials](#-demo-credentials)
- [NPM Scripts](#-npm-scripts)
- [Environment Configuration](#-environment-configuration)
- [Database & Schema](#-database--schema)
- [Deployment Guide](#-deployment-guide)
- [Troubleshooting & Windows Setup](#-troubleshooting--windows-setup)

---

## 🌟 Overview

**Lansub Travel OS** is a modern SaaS-style transportation enterprise system modeled around **National Travels** (operating 120+ luxury buses, 25+ branches, and 500+ daily intercity routes across South India).

It centralizes operational workflows into a single command hub:
- **Live Fleet Tracking**: Real-time Leaflet map showing GPS positions, vehicle status, and route telemetry.
- **Seat Inventory & Bookings**: Interactive seat layouts, boarding charts, passenger manifest, and multi-channel ticketing.
- **Trip & Crew Scheduling**: Automated roster management, driver scorecards, duty allocations, and trip profitability (P&L).
- **Maintenance & Workshop**: Work orders, spare parts inventory, preventative schedules, and breakdown alerts.
- **Finance & Analytics**: Fuel transactions, toll reconciliations, revenue leakage detection, and AI Copilot business insights.

---

## 🚀 Key Features & Modules

The platform includes **19 core application pages** organized with strict Role-Based Access Control (RBAC):

| Module | Route | Description | Access Roles |
|--------|-------|-------------|--------------|
| **Command Centre** | `/command-centre` | Real-time map with live bus telemetry, speed, status, and active incidents | Admin, Operations |
| **Operations Dashboard** | `/dashboard` | Executive KPIs, revenue metrics, occupancy rates, and active trip overviews | All Roles |
| **Trip Management** | `/trips` | Schedule daily schedules, assign buses/crews, track delays, and passenger manifests | All Roles |
| **Fleet Inventory** | `/fleet` | Bus catalog (sleeper, semi-sleeper, AC multi-axle), fitness certificates, and insurance | All Roles |
| **Bookings & Tickets** | `/bookings` | Booking engine, ticket issuance, cancellations, refunds, and boarding pass lookup | Admin, Booking |
| **Route Network** | `/routes` | Intercity routes, boarding/dropping points, estimated transit times, and toll costs | All Roles |
| **Driver Management** | `/drivers` | Performance scoring (safety, mileage, on-time rate), duty logs, and license validation | Admin, Fleet, HR |
| **Workshop & Maintenance** | `/maintenance` | Preventative service intervals, repair work orders, and parts consumption tracking | Admin, Fleet |
| **Fuel & Expense Log** | `/fuel` | Fuel transactions, mileage efficiency (km/L), bunk management, and variance audit | Admin, Fleet |
| **HR & Crew Management** | `/hr` | Staff records (700+ employees), payroll, shifts, biometric attendance, and leave requests | Admin, HR |
| **Passenger CRM** | `/customers` | Passenger profiles, booking history, loyalty points, and VIP customer tracking | Admin, Booking |
| **Business Analytics** | `/analytics` | Interactive charts, occupancy trends, route profitability, and demand forecasts | Admin, Finance |
| **Trip Financials & P&L** | `/finance` | Granular per-trip P&L, agent commissions, toll expenses, and net profit margins | Admin, Finance |
| **AI Copilot** | `/ai-copilot` | Natural language intelligence assistant for route optimization and operational queries | Admin, Ops, Finance |
| **Incident & Alerts** | `/alerts` | Automated triggers for speeding, route deviation, breakdown, and SOS signals | All Roles |
| **Customer Support** | `/complaints` | Grievance tickets, service complaints, resolution workflows, and customer feedback | All Roles |
| **System Settings** | `/settings` | Organization configuration, branch management, fare rules, and tax settings | Admin Only |

---

## 🛠 Tech Stack

### Frontend & Application Framework
- **Framework**: [Next.js 16.3.4](https://nextjs.org/) (App Router architecture, React Server Components)
- **UI Library**: [React 19.2.8](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss` & `tailwindcss-animate`
- **Component Primitives**: [Radix UI](https://www.radix-ui.com/) (Dialog, Popover, Dropdown, Tabs, Accordion, Tooltips, etc.)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Maps**: [Leaflet 1.9](https://leafletjs.com/) & [React-Leaflet 5](https://react-leaflet.js.org/)
- **Charts**: [Recharts 3.10](https://recharts.org/)
- **Toast Notifications**: [Sonner 2.0](https://sonner.emilkowal.ski/)
- **Date Handling**: [date-fns 4.4](https://date-fns.org/)

### Backend, Database & Auth
- **Database**: SQLite (via `better-sqlite3` native adapter for low latency) / Compatible with LibSQL & Turso
- **ORM**: [Prisma 7.10](https://www.prisma.io/) with `@prisma/adapter-better-sqlite3` driver adapter
- **Authentication**: [Auth.js / NextAuth v5](https://authjs.dev/) (Credentials provider, JWT session strategy, custom RBAC claims)
- **Security**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing

---

## 📂 Project Architecture

```
lansub-travel-os/
├── prisma/
│   ├── schema.prisma          # 28-model normalized database schema
│   ├── seed.ts                # Rich production-grade seed script (48KB)
│   └── migrations/            # Database schema migration history
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (modules)/         # 19 domain modules (trips, fleet, bookings, etc.)
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth v5 route handlers
│   │   │   └── v1/            # Modular REST API endpoints (trips, gps, alerts, etc.)
│   │   ├── layout.tsx         # Global layout with providers
│   │   └── globals.css        # Tailwind v4 theme definitions
│   ├── components/
│   │   ├── layout/
│   │   │   └── AdminLayout.tsx# Responsive sidebar navigation with role filtering
│   │   ├── command-centre/
│   │   │   └── MapView.tsx    # Interactive Leaflet live vehicle map
│   │   └── ui/                # Reusable Radix/Tailwind design system components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth authentication config & credential verification
│   │   ├── db.ts              # PrismaClient singleton with better-sqlite3 adapter
│   │   └── utils.ts           # Classnames helper (cn) and formatting utilities
│   ├── middleware.ts          # Route protection & session JWT verification
│   └── types/                 # Custom TypeScript interfaces & NextAuth session extensions
├── tsconfig.json              # TypeScript application configuration
├── tsconfig.seed.json         # Dedicated config for ts-node seed operations
└── package.json               # Dependencies and automation scripts
```

---

## ⚡ Quick Start & Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher
- **Build Tools**: Python & C++ compiler (required on Windows for `better-sqlite3` compilation)

### 2. Clone and Install Dependencies
```bash
git clone <repository-url>
cd lansub-travel-os
npm install
```

> **Note for Windows users**: If `better-sqlite3` fails or gives a binary architecture error:
> ```bash
> npm rebuild better-sqlite3
> ```

### 3. Setup Environment Variables
Create a `.env` file in the project root:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-super-secret-auth-key-at-least-32-chars-long"
NEXTAUTH_SECRET="your-super-secret-auth-key-at-least-32-chars-long"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialize Database & Seed
Sync your Prisma schema to SQLite and populate test data:
```bash
# Push schema to SQLite
npm run db:push

# Populate database with realistic fleet, branches, routes, and users
npm run db:seed
```

### 5. Launch Development Server
```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser and log in with any demo account below.

---

## 🔑 Demo Credentials

All test accounts use the default password: **`demo@123`**

| Role | Name | Email | Default Dashboard |
|------|------|-------|-------------------|
| **CEO / Owner** | Rajesh Kumar | `ceo@nationaltravels.demo` | Executive KPIs, Financials & Analytics |
| **Operations Manager** | Senthil Murugan | `ops@nationaltravels.demo` | Command Centre, Trips & Alerts |
| **Booking Manager** | Priya Lakshmi | `booking@nationaltravels.demo` | Seat Booking, CRM & Ticketing |
| **Fleet Manager** | Vikram Natarajan | `fleet@nationaltravels.demo` | Fleet Inventory, Fuel & Maintenance |
| **HR Manager** | Kavitha Sundaram | `hr@nationaltravels.demo` | Staff, Crew Rosters & Payroll |
| **Finance Manager** | Arun Krishnamurthy | `finance@nationaltravels.demo` | P&L Reports, Ledger & Expenses |
| **Platform Super Admin** | Super Admin | `admin@lansub.demo` | Global System Access & Configuration |

---

## 📜 NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `next dev` | Starts the Next.js development server |
| `npm run build` | `next build` | Compiles production-optimized client & server bundle |
| `npm run start` | `next start` | Runs the production Next.js server |
| `npm run lint` | `eslint` | Lints project code using ESLint 9 rules |
| `npm run db:push` | `prisma db push` | Syncs schema changes to the SQLite database |
| `npm run db:seed` | `ts-node prisma/seed.ts` | Populates database with sample fleet, trips & accounts |
| `npm run db:studio` | `prisma studio` | Opens Prisma visual database management GUI |
| `npm run db:reset` | `prisma db push --force-reset` | Wipes database and re-seeds fresh data |

---

## 🗄 Database & Schema

The schema contains **28 normalized relational models**:

- **Company & Organization**: `Company`, `Branch`, `Employee`, `User`
- **Fleet Assets**: `Vehicle`, `VehicleDocument`, `MaintenanceRecord`, `MaintenancePart`, `FuelEntry`
- **Route Network**: `City`, `Route`, `RouteStop`, `BoardingDroppingPoint`, `TollPlaza`
- **Operations & Scheduling**: `Trip`, `TripCrew`, `TripExpense`, `TripProfitability`, `Driver`
- **Ticketing & Customers**: `Booking`, `Passenger`, `Customer`, `LoyaltyPoint`
- **Safety, AI & Logs**: `Alert`, `Complaint`, `AiInsight`, `AiChat`, `AuditLog`

---

## 🐳 Deployment Guide

### Option A: Standalone VM (Ubuntu / Debian + PM2)
1. **Provision Node.js & Nginx** on the server.
2. Clone repository & install dependencies:
   ```bash
   npm ci
   npm run db:push
   npm run db:seed
   npm run build
   ```
3. Start process with **PM2**:
   ```bash
   pm2 start npm --name "lansub-os" -- start
   pm2 save
   pm2 startup
   ```
4. Reverse-proxy Nginx to `http://127.0.0.1:3000` with SSL via Certbot.

### Option B: Docker Container
Build and run using a Docker container:
```dockerfile
# Build image
docker build -t lansub-travel-os .

# Run container with persistent SQLite volume
docker run -d \
  -p 2500:3000 \
  -v $(pwd)/data:/app/prisma \
  --env-file .env \
  --name lansub-app \
  lansub-travel-os
```

---

## 🔧 Troubleshooting & Windows Setup

### 1. `better_sqlite3.node is not a valid Win32 application`
If you cloned the repo or copied `node_modules` from a Mac/Linux machine:
```bash
npm rebuild better-sqlite3
```

### 2. PowerShell Execution Policy or `ts-node` issues during seed
If running `npm run db:seed` fails on Windows due to quoting in CLI flags:
```bash
npx ts-node -P tsconfig.seed.json prisma/seed.ts
```

### 3. Resetting Database
To wipe and restore demo records from scratch:
```bash
npm run db:reset
```

---

## 📄 License

Proprietary — Developed for **National Travels & Lansub Systems**. All rights reserved.
