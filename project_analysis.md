# 🚌 LANSUB TRAVEL OS — Full Project Analysis

## Overview

**Lansub Travel OS** is a production-grade **Bus Travel Operations Management System** (SaaS-style) designed for transport companies. It's a monolithic Next.js full-stack application with a rich, role-based admin dashboard covering every operational aspect of a bus company — from booking management to AI-assisted analytics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js `16.3.4` (App Router) |
| **Language** | TypeScript 5 |
| **Database** | SQLite (via `better-sqlite3` + `@prisma/adapter-better-sqlite3`) |
| **ORM** | Prisma `7.10.0` |
| **Auth** | NextAuth v5 (beta) — Credentials provider, JWT sessions |
| **UI Components** | Radix UI primitives (full suite) |
| **Styling** | Tailwind CSS v4 + `tailwindcss-animate` + `class-variance-authority` |
| **Icons** | Lucide React |
| **Maps** | Leaflet + React Leaflet |
| **Charts** | Recharts |
| **Toast Notifications** | Sonner |
| **Date Utilities** | date-fns |
| **Password Hashing** | bcryptjs |
| **AI/Chat** | Custom AI Copilot module (DB-backed) |

---

## Project Structure

```
lansub-travel-os/
├── prisma/
│   ├── schema.prisma        ← Full normalized DB schema (874 lines, 28 models)
│   └── seed.ts              ← Rich seed data (48KB)
├── src/
│   ├── app/                 ← Next.js App Router pages
│   │   ├── (19 modules)     ← One directory per feature domain
│   │   ├── api/             ← REST API routes
│   │   │   ├── auth/        ← NextAuth handlers
│   │   │   └── v1/          ← API v1: ai, alerts, bookings, dashboard, drivers,
│   │   │                         gps, maintenance, routes, trips, vehicles
│   │   ├── layout.tsx       ← Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   └── AdminLayout.tsx  ← Full sidebar + responsive shell
│   │   └── command-centre/
│   │       └── MapView.tsx      ← Leaflet live map
│   ├── lib/
│   │   ├── auth.ts          ← NextAuth config + bcrypt login
│   │   ├── db.ts            ← Prisma client singleton
│   │   └── utils.ts         ← cn() + helper utilities
│   ├── middleware.ts         ← Route protection (JWT cookie check)
│   └── types/
│       └── next-auth.d.ts   ← Extended session types
└── tailwind.config.ts       ← Custom design tokens
```

---

## Application Modules (19 Pages)

| Module | Route | Description | Role Access |
|--------|-------|-------------|-------------|
| **Dashboard** | `/dashboard` | KPIs, summary metrics | ALL |
| **Command Centre** | `/command-centre` | Live map + real-time fleet view | Admin/Ops |
| **Trips** | `/trips` | Trip scheduling & management | ALL |
| **Fleet** | `/fleet` | Vehicle inventory & status | ALL |
| **Bookings** | `/bookings` | Seat booking & passenger management | Admin/Booking |
| **Routes** | `/routes` | Route & stop management | ALL |
| **Drivers** | `/drivers` | Driver profiles & performance scores | Admin/Fleet/HR |
| **Maintenance** | `/maintenance` | Maintenance scheduling & parts | Admin/Fleet |
| **Fuel** | `/fuel` | Fuel transactions & efficiency | Admin/Fleet |
| **HR & Crew** | `/hr` | Employee records, attendance, leaves | Admin/HR |
| **Customers** | `/customers` | Customer CRM + loyalty | Admin/Booking |
| **Analytics** | `/analytics` | Charts, revenue, occupancy trends | Admin/Finance |
| **Finance** | `/finance` | Trip P&L, expenses, commissions | Admin/Finance |
| **AI Copilot** | `/ai-copilot` | AI-assisted insights & chat | Admin/Ops/Finance |
| **Alerts** | `/alerts` | Vehicle & trip alert management | ALL |
| **Complaints** | `/complaints` | Customer complaint tracking | ALL |
| **Settings** | `/settings` | System configuration | Admin only |
| **Login** | `/login` | Auth page | Public |

---

## Database Schema — 28 Models

### Authentication & Organization
```
User ──── Company ──── Branch
│
└─── Employee ──── Driver
```

| Model | Purpose |
|-------|---------|
| `User` | Auth accounts with RBAC roles |
| `Company` | Multi-company SaaS support |
| `Branch` | Company branch offices |

**User Roles:** `SUPER_ADMIN`, `COMPANY_OWNER`, `OPERATIONS_MANAGER`, `BOOKING_MANAGER`, `FLEET_MANAGER`, `HR_MANAGER`, `FINANCE_MANAGER`

---

### HR & Employee Management
| Model | Purpose |
|-------|---------|
| `Employee` | Full employee records (payroll, banking, emergency) |
| `Driver` | Extended driver profile — safety, fuel efficiency, on-time scores |
| `EmployeeDocument` | Document vault (licence, ID, certificates) |
| `Attendance` | Daily check-in/out tracking |
| `Leave` | Leave requests with approval workflow |

---

### Fleet & Vehicles
| Model | Purpose |
|-------|---------|
| `Vehicle` | Full vehicle registry — specs, GPS, IoT telemetry fields |
| `VehicleDocument` | RC, insurance, permits (with expiry) |
| `VehicleMaintenance` | Scheduled/completed maintenance jobs |
| `MaintenancePart` | Parts used per maintenance job |
| `SeatLayout` | Per-vehicle seat configuration (seater/sleeper, decks) |
| `Seat` | Individual seat metadata (window, ladies, berth type) |

---

### GPS & IoT
| Model | Purpose |
|-------|---------|
| `GpsDevice` | GPS tracker registry |
| `GpsPosition` | Position history (lat/lng, speed, heading) |
| `IotDevice` | On-board IoT sensor device |
| `IotSensorData` | Engine temp, battery, fuel level, RPM — anomaly flagging |

---

### Operations
| Model | Purpose |
|-------|---------|
| `Route` | Origin→destination with distance, duration, toll costs |
| `RouteStop` | Ordered stop sequence with boarding/dropping types |
| `Trip` | Scheduled run: route + vehicle + crew + occupancy |
| `TripCrew` | Driver assignment per trip |

---

### Bookings & Customers
| Model | Purpose |
|-------|---------|
| `Customer` | CRM — segments, loyalty points, spend tracking |
| `Agent` | Travel agent accounts with commission/credit |
| `Booking` | Per-seat booking with fare breakdown, refunds |
| `BookingPassenger` | Multi-passenger per booking |
| `BookingPayment` | Payment gateway transactions |
| `Commission` | Monthly agent commission settlements |

---

### Financials
| Model | Purpose |
|-------|---------|
| `TripExpense` | Per-trip expense logging by category |
| `TripRevenue` | Revenue summary per trip |
| `TripProfitability` | Full P&L: revenue, fuel, toll, crew, maintenance costs |
| `PricingRule` | Route + seat type pricing rules (fixed/dynamic) |
| `PricingRecommendation` | AI-generated dynamic pricing suggestions |

---

### Alerts, Compliance & AI
| Model | Purpose |
|-------|---------|
| `Alert` | Vehicle/trip alerts (breakdown, speeding, etc.) |
| `Complaint` | Customer complaints with priority, assignment, resolution |
| `Notification` | User notification delivery (email/SMS/push) |
| `AiInsight` | AI-generated business insights |
| `AiChat` | Persistent AI copilot chat history per user |
| `AuditLog` | Full action audit trail with old/new values |

---

## Authentication & Security

- **NextAuth v5** with **Credentials provider** (email + bcrypt password)
- **JWT sessions** (24-hour max age)
- **Middleware** guards all routes except `/login`, `/api`, `/tracking`, `/_next`, `/static`
- Session enriched with `role`, `companyId`, `companyName`
- **RBAC** enforced both at middleware and UI navigation level
- Last-login timestamp updated on every successful login

---

## API Layer — `/api/v1/`

REST API routes organized by domain:

| Endpoint Group | Domain |
|---------------|--------|
| `/api/v1/ai` | AI insights & copilot |
| `/api/v1/alerts` | Alert management |
| `/api/v1/bookings` | Booking CRUD |
| `/api/v1/dashboard` | Dashboard KPI data |
| `/api/v1/drivers` | Driver data & scores |
| `/api/v1/gps` | GPS position updates |
| `/api/v1/maintenance` | Maintenance records |
| `/api/v1/routes` | Route management |
| `/api/v1/trips` | Trip scheduling |
| `/api/v1/vehicles` | Vehicle fleet |

---

## Key Architectural Patterns

1. **Monolithic Next.js** — Server and client code co-located; API routes serve the same app's UI
2. **SQLite for local/dev** — Using `better-sqlite3` adapter; schema is SQLite-compatible (no enums, uses String fields)
3. **Prisma v7** — Uses `@prisma/adapter-better-sqlite3` driver adapter pattern (new in Prisma 5+)
4. **Component-level RBAC** — Sidebar nav items filter by role from session; page-level access also role-gated
5. **Live Map** — Leaflet/React Leaflet for real-time command centre GPS view
6. **Soft Deletes** — `deletedAt` on `User`, `Employee`, `Vehicle`
7. **Scoring System** — `Driver` model has 5 composite scores: safety, on-time, fuel efficiency, customer rating, attendance → `overallScore`
8. **Multi-tenancy** — All core entities tied to `companyId` for data isolation

---

## Notable Design Decisions

> [!NOTE]
> The schema uses **String-typed enums** instead of Prisma/DB-level enums for SQLite compatibility. All status, role, type fields are plain strings.

> [!TIP]
> The `TripProfitability` model provides a **pre-computed P&L snapshot** per trip — likely calculated at trip completion to avoid expensive real-time joins across expenses, revenue, fuel, and crew tables.

> [!IMPORTANT]
> The project uses **Next.js 16.3.4** — this is a very recent/future version (current production Next.js is ~15.x). Verify that APIs match the installed version by checking `node_modules/next/dist/docs/` as mandated by `AGENTS.md`.

---

## Current State Assessment

| Area | Status |
|------|--------|
| DB Schema | ✅ Complete, production-grade, 28 models |
| Seed Data | ✅ Rich 48KB seed (realistic data) |
| Auth System | ✅ Fully implemented |
| Middleware | ✅ Route protection active |
| Navigation/Layout | ✅ Responsive sidebar with RBAC |
| API Routes | ✅ 10 domain groups under `/api/v1/` |
| App Pages | ✅ 19 page modules created |
| Live Map | ✅ Leaflet MapView component |
| AI Copilot | 🔶 DB-backed, needs to check implementation |
| Tests | ❌ No test files found |
| Production DB | 🔶 SQLite (suitable for dev; would need migration for production scale) |
