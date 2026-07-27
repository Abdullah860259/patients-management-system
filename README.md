# DentalCare — Patients Management System

A full-stack web application for managing dental clinic operations including patient registration, treatment tracking, payment processing, feedback management, and administrative analytics.

---

LIVE URL : https://patients-management-system-abdullah.vercel.app/
VIDEO URL : https://vimeo.com/1213291166

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| **Frontend** | React 19, Vite, TailwindCSS 4, Redux Toolkit, React Router 7, Recharts, Axios |
| **Backend**  | Node.js, Express 4, MongoDB (Mongoose 7), JWT, bcryptjs, Puppeteer (PDF) |
| **Dev Tools** | Nodemon, Oxlint                                      |

---

## Project Structure

```
Patients Mangement system/
├── README.md
├── opencode.json
├── backend/
│   ├── package.json
│   ├── server.js              # Express entry point, MongoDB connection, route mounting
│   ├── seed.js                # Database seeder (100 patients, treatments, payments, feedback)
│   ├── test.js                # PDF generation test script
│   ├── .env                   # Environment variables (PORT, MONGODB_URI, JWT_SECRET)
│   ├── controllers/
│   │   ├── authController.js              # Register, login, logout, getMe, changePassword, updateProfile
│   │   ├── adminController.js             # Dashboard, CRUD treatments/payments/patients/feedback, analytics, PDF generation
│   │   ├── adminManagementController.js   # CRUD admins (CEO-only)
│   │   ├── feedbackController.js          # Patient feedback CRUD
│   │   ├── paymentController.js           # Patient payment listing/stats
│   │   └── treatmentController.js         # Patient treatment listing/stats
│   ├── middleware/
│   │   └── auth.js            # JWT verification, role-based authorization middleware
│   ├── models/
│   │   ├── User.js            # Patients, admins, CEO — idNumber, treatments subdocs, timestamps
│   │   ├── Treatment.js       # Service catalog — name, description, cost, durationDays, minAdvanceAmount
│   │   ├── Payment.js         # Payments linked to patient+treatment, auto-generated receipt numbers
│   │   └── Feedback.js        # Patient feedback with categories, ratings, CEO response, internal notes
│   ├── routes/
│   │   ├── auth.js            # POST /register, /login, /logout; GET /me; PUT /update-profile, /change-password
│   │   ├── patient.js         # Patient-only: treatments, payments, feedback (all GET + POST feedback)
│   │   └── admin.js           # Admin/CEO: dashboard, analytics, full CRUD for treatments/payments/patients/feedback/admins
│   ├── services/
│   │   ├── authService.js     # User lookup, create, update, password change
│   │   ├── adminService.js    # Dashboard stats, paginated queries for patients/treatments/payments/feedbacks/admins
│   │   ├── feedbackService.js # Feedback queries
│   │   ├── paymentService.js  # Payment queries
│   │   └── treatmentService.js# Treatment queries
│   └── pdf/
│       ├── generatePrescription.js   # Puppeteer-based prescription PDF from HTML template
│       ├── generateTreatment.js       # Puppeteer-based treatment summary PDF from HTML template
│       ├── prescription/index.html    # Prescription HTML template
│       └── treatment/index.html       # Treatment summary HTML template
├── frontend/
│   ├── package.json
│   ├── index.html              # Entry HTML with Inter font
│   ├── vite.config.js          # Vite + React + TailwindCSS, proxy /api -> localhost:5000
│   ├── .oxlintrc.json
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.jsx            # React root with Redux Provider, BrowserRouter
│       ├── App.jsx             # Route definitions, ProtectedRoute/PublicRoute guards, Navbar/Footer layout
│       ├── index.css           # TailwindCSS, custom theme colors (primary cyan, secondary indigo, accent amber)
│       ├── assets/             # Static images (hero.png, vite.svg)
│       ├── utils/
│       │   └── api.js          # Axios instance with JWT interceptor, auto-logout on 401
│       ├── store/
│       │   ├── index.js        # Redux store config
│       │   └── slices/
│       │       ├── authSlice.js        # Login, register, fetchMe, changePassword, updateProfile
│       │       ├── adminSlice.js       # Dashboard, analytics, admin CRUD, patient/treatment/payment/feedback management
│       │       ├── treatmentSlice.js   # Patient treatments fetch + stats
│       │       ├── paymentSlice.js     # Patient payments fetch + stats
│       │       └── feedbackSlice.js    # Patient feedback fetch, submit, stats
│       ├── components/
│       │   ├── Navbar.jsx              # Responsive nav with role-based links, user dropdown
│       │   ├── Footer.jsx              # Site footer
│       │   ├── MobileMenu.jsx          # Mobile hamburger menu
│       │   ├── UserDropdown.jsx        # Profile/logout dropdown
│       │   ├── auth/
│       │   │   ├── StepOne.jsx         # Registration step 1: personal info
│       │   │   └── StepTwo.jsx         # Registration step 2: account setup
│       │   ├── dashboard/
│       │   │   ├── StatCards.jsx       # Patient dashboard stat cards
│       │   │   ├── QuickActions.jsx    # Patient quick action buttons
│       │   │   ├── TreatmentCard.jsx   # Treatment summary card
│       │   │   ├── PaymentCard.jsx     # Payment history card
│       │   │   ├── PaymentStats.jsx    # Payment statistics
│       │   │   ├── FeedbackCard.jsx    # Feedback display card
│       │   │   ├── FeedbackForm.jsx    # Submit feedback form
│       │   │   ├── FeedbackOverview.jsx# Feedback overview
│       │   │   └── UpcomingAppointments.jsx # Upcoming appointments widget
│       │   ├── admin/
│       │   │   ├── AdminStatsCards.jsx       # Admin dashboard stat cards (revenue, patients, etc.)
│       │   │   ├── AdminQuickActions.jsx     # Admin quick actions (create patient, record payment, etc.)
│       │   │   ├── RecentTreatmentsTable.jsx # Recent treatments data table
│       │   │   ├── RecentFeedbacksList.jsx   # Recent feedback list
│       │   │   └── PatientProfileModal.jsx   # Patient detail modal
│       │   └── home/
│       │       ├── HeroSection.jsx           # Landing page hero
│       │       ├── StatsSection.jsx          # Clinic statistics
│       │       ├── ServicesSection.jsx       # Services showcase
│       │       ├── FeaturesSection.jsx       # Feature highlights
│       │       ├── TestimonialsSection.jsx   # Patient testimonials
│       │       └── CTASection.jsx            # Call-to-action section
│       └── pages/
│           ├── Home.jsx                # Landing page
│           ├── Login.jsx               # Login form
│           ├── Register.jsx            # Two-step registration form
│           ├── Dashboard.jsx           # Patient dashboard
│           ├── PatientProfile.jsx      # Patient profile management
│           ├── Treatments.jsx          # Treatment list (patient & admin views)
│           ├── Payments.jsx            # Payment list (patient & admin views)
│           ├── Feedback.jsx            # Feedback list & submission
│           ├── AdminDashboard.jsx      # Admin/CEO dashboard
│           ├── Analytics.jsx           # CEO analytics with Recharts (revenue, growth, feedback, etc.)
│           ├── AdminPatients.jsx       # Patient management (admin/CEO)
│           └── AdminManagement.jsx     # Admin user management (CEO only)
```

---

## What This Web App Does

### Overview
DentalCare is a **role-based dental clinic management system** with three user tiers — **Patient**, **Admin**, and **CEO** — each with distinct dashboards and capabilities.

### Features by Role

#### Patient
- **Registration & Login** — Two-step signup, JWT-based authentication
- **Dashboard** — Overview of treatment stats and payment stats with quick actions
- **Treatments** — View assigned treatments with status (ongoing/completed) and cost breakdown
- **Payments** — View payment history with receipt numbers, amounts, methods, and dates
- **Feedback** — Submit, view, and track feedback with categories and ratings (1–5 stars)
- **Profile Management** — Edit personal info, address, emergency contact, dental history, and allergies

#### Admin
- **Dashboard** — Stats cards (total patients, treatments, payments, revenue), recent treatments table, recent feedback list, quick actions
- **Patient Management** — Search, view, and create patients (auto-assigns a checkup treatment on creation)
- **Treatment Catalog** — View all treatments (CEO creates/edits/deletes)
- **Payment Recording** — Create payments for patients against treatments with validation (cannot exceed cost)
- **Prescription PDF** — Generate prescription PDFs for patients via Puppeteer
- **Treatment Summary PDF** — Generate treatment summary PDFs with payment breakdown

#### CEO
- Everything an Admin can do, **plus**:
- **Analytics Dashboard** — Comprehensive charts and metrics:
  - Revenue by month (bar chart)
  - Payment count by month (line chart)
  - Top treatments by popularity and revenue
  - Payment method distribution and trends
  - Patient growth over time
  - Patient gender distribution
  - Feedback ratings distribution, by category, by month
  - Admin performance breakdown (revenue, payment count, patients created, method usage)
- **Admin Management** — Create, update, delete admin users
- **Feedback Management** — View all feedback, respond as CEO, track status (Submitted → Under Review → Acknowledged → Resolved)
- **Treatment CRUD** — Full create/update/delete for the treatment catalog

### API Endpoints

#### Auth (`/api/auth`)
| Method | Endpoint           | Access        | Description               |
|--------|--------------------|---------------|---------------------------|
| POST   | `/register`        | Public        | Register new patient      |
| POST   | `/login`           | Public        | Login                     |
| POST   | `/logout`          | Authenticated | Clear auth cookie         |
| GET    | `/me`              | Authenticated | Get current user profile  |
| PUT    | `/update-profile`  | Authenticated | Update profile fields     |
| PUT    | `/change-password` | Authenticated | Change password           |

#### Patient (`/api/patient`)
| Method | Endpoint               | Access        | Description                      |
|--------|------------------------|---------------|----------------------------------|
| GET    | `/treatments`          | Authenticated | Patient's treatment list         |
| GET    | `/treatments/stats`    | Authenticated | Patient's treatment stats        |
| GET    | `/treatments/:id`      | Authenticated | Single treatment detail          |
| GET    | `/payments`            | Authenticated | Patient's payment history        |
| GET    | `/payments/stats`      | Authenticated | Patient's payment stats          |
| GET    | `/payments/:id`        | Authenticated | Single payment detail            |
| GET    | `/feedback`            | Authenticated | Patient's feedback list          |
| GET    | `/feedback/stats`      | Authenticated | Patient's feedback stats         |
| POST   | `/feedback`            | Authenticated | Submit feedback                  |
| GET    | `/feedback/:id`        | Authenticated | Single feedback detail           |

#### Admin (`/api/admin`)
| Method | Endpoint                           | Access         | Description                         |
|--------|------------------------------------|----------------|-------------------------------------|
| GET    | `/dashboard`                       | Admin/CEO      | Dashboard stats + recent data       |
| GET    | `/analytics`                       | CEO            | Full analytics (all charts/metrics) |
| GET    | `/treatments`                      | Admin/CEO      | Paginated treatment list            |
| POST   | `/treatments`                      | CEO            | Create treatment                    |
| PUT    | `/treatments/:id`                  | CEO            | Update treatment                    |
| DELETE | `/treatments/:id`                  | CEO            | Delete treatment                    |
| GET    | `/treatments/stats`                | Admin/CEO      | Treatment count                     |
| GET    | `/payments`                        | Admin/CEO      | Paginated payments (admin sees own) |
| POST   | `/payments`                        | Admin/CEO      | Create payment for patient          |
| GET    | `/payments/stats`                  | Admin/CEO      | Total revenue                       |
| GET    | `/payments/:id/treatment-summary`  | Admin/CEO      | Generate treatment summary PDF      |
| GET    | `/feedback`                        | CEO            | All feedback (paginated, filterable)|
| GET    | `/feedback/stats`                  | CEO            | Feedback stats (submitted/resolved) |
| PUT    | `/feedback/:id/respond`            | CEO            | Respond to feedback                 |
| GET    | `/patients`                        | Admin/CEO      | Paginated patient list with search  |
| POST   | `/patients`                        | Admin/CEO      | Create patient with auto-checkup    |
| GET    | `/patients/:id/prescription`       | Admin/CEO      | Generate prescription PDF           |
| GET    | `/admins`                          | CEO            | Paginated admin list                |
| POST   | `/admins`                          | CEO            | Create admin                        |
| PUT    | `/admins/:id`                      | CEO            | Update admin                        |
| DELETE | `/admins/:id`                      | CEO            | Delete admin                        |

### Database Models

**User** — Patients, admins, and CEO with embedded `treatments[]` subdocuments tracking status, cost, paid amount, and payment references. Auto-generates a 10-digit `idNumber` and hashes passwords via bcrypt pre-save hook.

**Treatment** — Clinic service catalog: name, description, cost, duration in days, minimum advance amount.

**Payment** — Records payment against a patient+treatment, with auto-generated receipt number (`RCPT-YYMMDD-XXXX`), payment method enum, and processed-by admin reference.

**Feedback** — Patient feedback with category enum (11 types), subject, message, rating (1–5), status workflow (Submitted→Under Review→Acknowledged→Resolved→Closed), optional CEO response, internal notes, and anonymous flag.

### PDF Generation
Uses Puppeteer to render HTML templates into PDFs:
- **Prescription** — Patient name, age, sex, admin details
- **Treatment Summary** — Patient name, treatment name, paid amount, remaining balance, admin details

---

## Setup & Running

### Prerequisites
- Node.js >= 18
- MongoDB instance (local or Atlas)

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run seed    # Seed database with sample data (100 patients, treatments, payments, feedback)
npm run dev     # Start with nodemon on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev     # Vite dev server on port 3000 (proxies /api to :5000)
```

### Test Accounts (after seeding)
| Role   | Email              | Password     |
|--------|--------------------|--------------|
| CEO    | ceo@clinic.com     | password123  |
| Admin  | admin1@clinic.com  | password123  |
| Admin  | admin2@clinic.com  | password123  |
| Patient| (random emails)    | password123  |

---

## Key Design Decisions

- **JWT in httpOnly cookie** + Authorization header for secure auth
- **Role-based route protection** via `authorize()` middleware (patient/admin/ceo)
- **Admin data isolation** — admins only see patients/treatments/payments they created
- **Embedded treatment records** in User documents for efficient reads (avoiding join-heavy queries)
- **Aggregation pipeline** for analytics (revenue trends, treatment popularity, admin performance, etc.)
- **Puppeteer PDF generation** from HTML templates for prescriptions and treatment summaries
- **Redux Toolkit** for state management with async thunks for all API calls
- **TailwindCSS 4** with custom theme for consistent styling
- **Recharts** for interactive analytics charts (bar, line, pie, radar)
