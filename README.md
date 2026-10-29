# InternShield 🛡️

> **Full Stack Development (FSD) Course Project**  
> An intelligent MERN platform safeguarding students against predatory internship scams, auditing resume ATS keyword compatibility, analyzing role-specific technical skill gaps, and delivering verified opportunity recommendations.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Core Features](#-core-features)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Folder Structure](#-folder-structure)
5. [Database Models (Mongoose)](#-database-models-mongoose)
6. [Setup & Installation](#-setup--installation)
   - [Local MongoDB Setup](#local-mongodb-setup)
   - [MongoDB Atlas Setup](#mongodb-atlas-cloud-setup)
   - [Running Backend & Frontend](#running-backend--frontend)
7. [Default Test Credentials](#-default-test-credentials)
8. [REST API Endpoint Directory](#-rest-api-endpoint-directory)
9. [FSD Syllabus Experiment Mapping Table (Exp 1 - 12)](#-fsd-syllabus-experiment-mapping-table)
10. [Viva Examination Walkthrough Guide](#-viva-examination-walkthrough-guide)

---

## 🌟 Project Overview

College students regularly face deceptive internship offers demanding security deposits, registration fees, or unpaid repetitive labor with zero mentorship. **InternShield** combats this problem with a 5-pillar security framework:
1. **Fake vs Real Internship Detector**: Computes a Trust Score (0-100) using a 9-rule heuristic engine combined with verified scam blacklists.
2. **ATS Resume Builder & Tailor**: Single-column ATS template auditing keyword match against real Job Descriptions (JDs) and tailoring layout without fabricating experience.
3. **Verified Internship Recommendations**: Ranks verified enterprise opportunities against student skills with match percentage and missing skill indicators.
4. **Recruiter Blacklist Registry**: Crowdsourced student reporting portal with an administrative approval queue.
5. **Role Skill Gap Analyzer**: Evaluates student competencies against industry job matrices and curates 100% free courses.

---

## 🚀 Core Features

- **Rule-Based Scam Detector**: Evaluates demands for money (-35), free generic email domains (-15), domain/company mismatch (-10), artificial urgency (-10), WhatsApp/Telegram exclusivity (-15), inflated compensation (-15), and active database blacklist records (-40).
- **ATS Resume Analyzer**: Built-in 150+ technology dictionary detecting matched & missing keywords, generating an ATS compatibility score, and providing print-optimized A4 export (`window.print()`).
- **Automated Alerts (node-cron)**: Background worker running every 10 minutes (and triggered immediately on new verified posts) alerting students with $\ge$ 50% skill match.
- **Admin Panel (EJS SSR)**: Server-rendered administrative command center with table loops, moderation actions, and form handling at `/admin`.
- **Dark / Light Theme Engine**: Real-time theme toggle persisted via `localStorage` and customized Sass tokens.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Sass (SCSS) + CSS Modules, Lucide React |
| **Backend** | Node.js, Express.js (REST JSON APIs + EJS SSR) |
| **Database** | MongoDB (Local Daemon or Atlas Cluster) with Mongoose ODM |
| **Auth** | `express-session` + `connect-mongo` (MongoDB session store), `cookie-parser`, `bcryptjs` |
| **Automation** | `node-cron` background worker, `express-validator` input validation |

---

## 📂 Folder Structure

```text
internshield/
├── backend/
│   ├── .env.example              # Environment variables template
│   ├── server.js                 # Express server & middleware pipeline
│   ├── config/
│   │   └── db.js                 # Mongoose connection logic
│   ├── models/                   # Mongoose Schemas & Indexes
│   │   ├── User.js               # Students and admin accounts
│   │   ├── Internship.js         # Listings with compound & text indexes
│   │   ├── Report.js             # Blacklist reports collection
│   │   ├── Alert.js              # Automated student job notifications
│   │   └── Course.js             # Free accredited course resources
│   ├── middleware/
│   │   ├── logger.js             # Custom application-level HTTP logger
│   │   ├── auth.js               # requireLogin and requireAdmin session guards
│   │   ├── errorHandler.js       # Centralized 4-argument error handler
│   │   └── validate.js           # express-validator wrapper
│   ├── routes/
│   │   ├── authRoutes.js         # Register, Login, Logout, Profile
│   │   ├── internshipRoutes.js   # CRUD + URL building
│   │   ├── detectorRoutes.js     # Rule engine endpoint
│   │   ├── resumeRoutes.js       # ATS scoring & Tailoring
│   │   ├── recommendRoutes.js    # Verified recommendation engine
│   │   ├── reportRoutes.js       # Blacklist check & report filing
│   │   ├── skillGapRoutes.js     # Target role skill gap analyzer
│   │   ├── alertRoutes.js        # Notification feeds & read toggles
│   │   ├── demoRoutes.js         # Lab Exp 1-3, 6, 11 demo routes
│   │   └── adminRoutes.js        # EJS Admin panel routes
│   ├── controllers/              # Business logic controllers
│   ├── utils/
│   │   ├── detector.js           # 9-rule scoring logic
│   │   ├── skillExtractor.js     # 150+ keyword dictionary & regex parser
│   │   ├── matcher.js            # Skill overlap algorithm
│   │   └── alertJob.js           # node-cron scheduled worker
│   ├── views/                    # EJS Templates
│   │   ├── about.ejs             # Public SSR page (Exp 2)
│   │   ├── admin-login.ejs       # Admin login screen
│   │   ├── admin-dashboard.ejs   # Admin stats, tables & loops
│   │   ├── admin-reports.ejs     # Moderation queue with HTML forms
│   │   └── admin-add-internship.ejs # Post verified internship form
│   ├── seed/
│   │   └── seed.js               # Test data population script
│   └── mongo-queries/
│       ├── crud.js               # Exp 9: Mongosh CRUD operations
│       ├── advanced.js           # Exp 10: Aggregations & indexing
│       ├── run-crud.js           # Executable CRUD script via Node
│       └── run-advanced.js       # Executable Aggregations script via Node
├── frontend/
│   ├── index.html                # Vite entry template
│   ├── vite.config.js            # Bundler configuration
│   └── src/
│       ├── main.jsx              # React 18 createRoot & BrowserRouter
│       ├── App.jsx               # Routes & Provider hierarchy
│       ├── api/axios.js          # Axios client with withCredentials: true
│       ├── context/              # React Context Providers
│       │   ├── AuthContext.jsx   # Session authentication state
│       │   ├── AlertContext.jsx  # Unread badge & notifications state
│       │   └── ThemeContext.jsx  # Dark/Light mode state
│       ├── hooks/                # Custom React Hooks
│       │   ├── useFetch.js       # Encapsulated HTTP lifecycle
│       │   ├── useDebounce.js    # Debounced input hook
│       │   └── useLocalStorage.js# Browser persistence hook
│       ├── components/           # Reusable UI Components
│       │   ├── Navbar.jsx        # Responsive navigation with AlertBell
│       │   ├── Footer.jsx        # Footer with syllabus references
│       │   ├── ProtectedRoute.jsx# Auth route guard
│       │   ├── TrustMeter.jsx    # Circular animated gauge
│       │   ├── ClassTrustMeter.jsx # Class component demonstration (Exp 5)
│       │   ├── ErrorBoundary.jsx # Class Error Boundary (Exp 5)
│       │   ├── InternshipCard.jsx# Job card with hover effects & badges
│       │   ├── SkillBadge.jsx    # Matched/Missing status badge
│       │   ├── AlertBell.jsx     # Unread count badge
│       │   ├── Loader.jsx        # CSS animated spinner
│       │   └── FormInput.jsx     # Accessible form control
│       ├── pages/                # Application Views
│       │   ├── Home.jsx          # Hero, stats & 3-step workflow
│       │   ├── Login.jsx         # Sign in with viva demo buttons
│       │   ├── Register.jsx      # Student registration
│       │   ├── Dashboard.jsx     # Control center & readiness widget
│       │   ├── Detector.jsx      # Scam inspector with preset buttons
│       │   ├── ResumeBuilder.jsx # ATS analysis, tailoring & A4 print preview
│       │   ├── Recommendations.jsx # Filterable verified job directory
│       │   ├── RecruiterCheck.jsx# Blacklist checker & report submission
│       │   ├── SkillGap.jsx      # Role comparison & free course cards
│       │   ├── Alerts.jsx        # Notification feed
│       │   ├── Profile.jsx       # Skill tag manager & details
│       │   └── NotFound.jsx      # 404 handler
│       └── styles/               # SCSS Styling Architecture
│           ├── _variables.scss   # Color tokens & theme palettes
│           ├── _mixins.scss      # Media queries & layout mixins
│           └── main.scss         # Global SCSS stylesheet & @media print
├── API.http                      # VS Code REST Client testing collection
└── README.md                     # Full documentation & syllabus mapping
```

---

## ⚙️ Setup & Installation

### Local MongoDB Setup
1. Ensure MongoDB is running locally on port `27017`:
   ```bash
   mongod --dbpath <path-to-data-directory>
   ```
2. Your connection string in `backend/.env` will be:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/internshield
   ```

### MongoDB Atlas (Cloud) Setup
If you prefer running on MongoDB Atlas instead of a local database:
1. Navigate to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign in.
2. Click **Build a Database** $\rightarrow$ Choose the **M0 Free Shared Cluster**.
3. Under **Security Quickstart**:
   - Create a Database User (e.g., username `internshield_admin`, secure password).
   - Under **IP Access List**, add `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** $\rightarrow$ **Drivers** $\rightarrow$ Copy the connection string.
5. In `backend/.env`, replace `MONGO_URI`:
   ```env
   MONGO_URI=mongodb+srv://internshield_admin:<password>@cluster0.mongodb.net/internshield?retryWrites=true&w=majority
   ```

### Running Backend & Frontend

#### 1. Backend Server Setup
Open a terminal in the root directory:
```bash
cd backend

# 1. Install dependencies
npm install

# 2. Seed database (25 internships, 15 reports, 30 courses, test users)
npm run seed

# 3. Start development server with nodemon
npm run dev
```
> Backend runs at: `http://localhost:5000`  
> Admin Panel (EJS): `http://localhost:5000/admin`  
> Public SSR Page: `http://localhost:5000/about`  

#### 2. Frontend Application Setup
Open a second terminal in the root directory:
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Launch Vite development server
npm run dev
```
> React Frontend runs at: `http://localhost:5173`

---

## 🔑 Default Test Credentials

For quick evaluation during the lab viva, pre-configured seed credentials are provided:

| Role | Email | Password | Permissions & Data |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@internshield.com` | `Admin@123` | Full access to `/admin` EJS moderation panel, post/verify internships, approve blacklist reports |
| **Student 1** | `aarav.sharma@college.edu` | `Student@123` | Target Role: *Web Developer* (React, JS, HTML, CSS, Git) |
| **Student 2** | `priya.patel@techuniv.ac.in` | `Student@123` | Target Role: *Data Analyst* (Python, SQL, Pandas, Tableau) |

*(Note: The Login page contains one-click "Student Demo" and "Admin Demo" fill buttons for instant testing).*

---

## 📡 REST API Endpoint Directory

Mounted under `/api`:

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create user account & initialize session | Public |
| `POST` | `/api/auth/login` | Compare bcrypt hash & set session cookie | Public |
| `POST` | `/api/auth/logout` | Destroy session & clear `connect.sid` cookie | Public |
| `GET` | `/api/auth/me` | Fetch active authenticated user profile | Logged-in |
| `PUT` | `/api/auth/profile` | Update skills, education, target role | Logged-in |
| `GET` | `/api/internships` | Paginated search, filter, sort & HATEOAS links | Public |
| `GET` | `/api/internships/:id` | Fetch single internship details | Public |
| `POST` | `/api/internships` | Create listing (Triggers alert worker if verified) | Admin |
| `PUT` | `/api/internships/:id` | Update internship listing | Admin |
| `DELETE`| `/api/internships/:id`| Remove internship listing | Admin |
| `POST` | `/api/detector/analyze` | 9-rule scoring engine (returns 0-100 Trust Score) | Public |
| `POST` | `/api/resume/analyze` | ATS keyword audit against Job Description | Public |
| `POST` | `/api/resume/tailor` | Reorder skills & projects by match (No fabrication)| Public |
| `GET` | `/api/recommend` | Top 10 verified internships matched to user skills | Logged-in |
| `GET` | `/api/reports/check` | Check if recruiter email/phone has approved fraud reports| Public |
| `POST` | `/api/reports` | File a new fraud report (enters pending status) | Logged-in |
| `GET` | `/api/reports/mine` | View logged-in student's submitted reports | Logged-in |
| `DELETE`| `/api/reports/:id` | Delete report | Owner/Admin |
| `GET` | `/api/skillgap` | Compare skills against role matrix + free courses | Logged-in |
| `GET` | `/api/alerts` | Get automated job alerts (`?unread=true` filter) | Logged-in |
| `PATCH` | `/api/alerts/read-all`| Mark all user alerts as read | Logged-in |
| `PATCH` | `/api/alerts/:id/read`| Mark single alert as read | Logged-in |
| `DELETE`| `/api/alerts/:id` | Remove notification | Logged-in |

### Syllabus Demonstration Routes (`/api/demo`)
- `GET /api/demo/hello` $\rightarrow$ Defining & handling routes (Exp 1a)
- `GET /api/demo/users/:id` $\rightarrow$ Route parameters `req.params` (Exp 3a)
- `GET /api/demo/search?q=node&limit=5` $\rightarrow$ Query parameters `req.query` (Exp 3b)
- `GET /api/demo/url-building` $\rightarrow$ URL API & `req.originalUrl` (Exp 3c)
- `POST /api/demo/items`, `GET /api/demo/items`, `DELETE /api/demo/items/:id` $\rightarrow$ In-memory HTTP methods (Exp 1b)
- `GET /api/demo/protected-by-key` $\rightarrow$ Route-level middleware (`checkApiKey`) (Exp 6)
- `GET /api/demo/set-cookie`, `read-cookie`, `clear-cookie` $\rightarrow$ Cookie management (Exp 11)
- `GET /api/demo/visits` $\rightarrow$ Stateful session tracking (Exp 11)
- `GET /api/demo/trigger-error` $\rightarrow$ Centralized error handler testing (Exp 6)

---

## 📊 FSD Syllabus Experiment Mapping Table

This project is tailored specifically to address every experiment in the Full Stack Development syllabus:

| Exp # | Syllabus Topic | Exact Project File(s) Demonstrating Concept |
| :---: | :--- | :--- |
| **1a** | Express Defining & Handling Routes | [`backend/routes/demoRoutes.js`](file:///c:/projects/internshield/backend/routes/demoRoutes.js), [`backend/routes/authRoutes.js`](file:///c:/projects/internshield/backend/routes/authRoutes.js) |
| **1b** | Express HTTP Methods (`POST`, `GET`, `DELETE`) & In-memory collection | [`backend/controllers/demoController.js#L78-L135`](file:///c:/projects/internshield/backend/controllers/demoController.js#L78-L135), [`backend/controllers/internshipController.js`](file:///c:/projects/internshield/backend/controllers/internshipController.js) |
| **2** | Server-Side Templating (EJS) & HTML Forms Handling | [`backend/views/admin-dashboard.ejs`](file:///c:/projects/internshield/backend/views/admin-dashboard.ejs), [`backend/views/admin-reports.ejs`](file:///c:/projects/internshield/backend/views/admin-reports.ejs), [`backend/views/admin-add-internship.ejs`](file:///c:/projects/internshield/backend/views/admin-add-internship.ejs), [`backend/views/about.ejs`](file:///c:/projects/internshield/backend/views/about.ejs) |
| **3a** | Express Route Parameters (`req.params`) | [`backend/controllers/demoController.js#L26-L40`](file:///c:/projects/internshield/backend/controllers/demoController.js#L26-L40), [`backend/controllers/internshipController.js#L104-L121`](file:///c:/projects/internshield/backend/controllers/internshipController.js#L104-L121) |
| **3b** | Express Query Parameters (`req.query`) | [`backend/controllers/demoController.js#L42-L58`](file:///c:/projects/internshield/backend/controllers/demoController.js#L42-L58), [`backend/controllers/internshipController.js#L14-L60`](file:///c:/projects/internshield/backend/controllers/internshipController.js#L14-L60) |
| **3c** | Express URL Building (`URL`, `URLSearchParams`, HATEOAS links) | [`backend/controllers/demoController.js#L60-L76`](file:///c:/projects/internshield/backend/controllers/demoController.js#L60-L76), [`backend/controllers/internshipController.js#L72-L96`](file:///c:/projects/internshield/backend/controllers/internshipController.js#L72-L96) |
| **4** | React Components, JSX Expressions, Sass & CSS | [`frontend/src/main.jsx`](file:///c:/projects/internshield/frontend/src/main.jsx), [`frontend/src/styles/main.scss`](file:///c:/projects/internshield/frontend/src/styles/main.scss), [`frontend/src/components/TrustMeter.jsx`](file:///c:/projects/internshield/frontend/src/components/TrustMeter.jsx), [`frontend/src/pages/Home.jsx`](file:///c:/projects/internshield/frontend/src/pages/Home.jsx) |
| **5** | Function vs Class Components & Lifecycle Methods | [`frontend/src/components/ClassTrustMeter.jsx`](file:///c:/projects/internshield/frontend/src/components/ClassTrustMeter.jsx) (Class), [`frontend/src/components/ErrorBoundary.jsx`](file:///c:/projects/internshield/frontend/src/components/ErrorBoundary.jsx) (Class), [`frontend/src/components/TrustMeter.jsx`](file:///c:/projects/internshield/frontend/src/components/TrustMeter.jsx) (Function nesting Class) |
| **6** | Express Middleware: Custom Logger, Built-in, Third-Party, Error Handler | [`backend/middleware/logger.js`](file:///c:/projects/internshield/backend/middleware/logger.js), [`backend/middleware/errorHandler.js`](file:///c:/projects/internshield/backend/middleware/errorHandler.js), [`backend/server.js#L35-L65`](file:///c:/projects/internshield/backend/server.js#L35-L65), [`backend/routes/demoRoutes.js#L10-L21`](file:///c:/projects/internshield/backend/routes/demoRoutes.js#L10-L21) |
| **7** | React Hooks (`useState`, `useEffect`, `useReducer`, `useContext`, `useMemo`, `useDebounce`, custom hooks) | [`frontend/src/pages/ResumeBuilder.jsx`](file:///c:/projects/internshield/frontend/src/pages/ResumeBuilder.jsx) (`useReducer`), [`frontend/src/hooks/useDebounce.js`](file:///c:/projects/internshield/frontend/src/hooks/useDebounce.js), [`frontend/src/hooks/useFetch.js`](file:///c:/projects/internshield/frontend/src/hooks/useFetch.js), [`frontend/src/context/AuthContext.jsx`](file:///c:/projects/internshield/frontend/src/context/AuthContext.jsx) |
| **8** | React Router: Routes, Navigation, ProtectedRoute & 404 | [`frontend/src/App.jsx`](file:///c:/projects/internshield/frontend/src/App.jsx), [`frontend/src/components/ProtectedRoute.jsx`](file:///c:/projects/internshield/frontend/src/components/ProtectedRoute.jsx), [`frontend/src/pages/NotFound.jsx`](file:///c:/projects/internshield/frontend/src/pages/NotFound.jsx) |
| **9** | MongoDB CRUD Shell Queries (`insertOne`, `find`, `updateOne`, `$set`, `$inc`, `$push`, `deleteOne`) | [`backend/mongo-queries/crud.js`](file:///c:/projects/internshield/backend/mongo-queries/crud.js), [`backend/mongo-queries/run-crud.js`](file:///c:/projects/internshield/backend/mongo-queries/run-crud.js) (Run: `npm run mongo:crud`) |
| **10** | MongoDB Advanced Queries: DDL, Sorting, Indexing (Single, Compound, Text), Aggregations (`$group`, `$unwind`, `$sort`) | [`backend/mongo-queries/advanced.js`](file:///c:/projects/internshield/backend/mongo-queries/advanced.js), [`backend/mongo-queries/run-advanced.js`](file:///c:/projects/internshield/backend/mongo-queries/run-advanced.js) (Run: `npm run mongo:advanced`) |
| **11** | Full Stack MERN Integration: Session Auth, Mongoose ODM, Cron, Cookies | Complete architecture across `backend/` and `frontend/` |
| **12** | Full Stack Application Deployment & Testing | Complete runnable application with scripts, seeding & `API.http` test suite |

---

## 🎤 Viva Examination Walkthrough Guide

When presenting this project to the external examiner, demonstrate the following step-by-step sequence:

1. **Architecture & Startup**:
   - Explain that backend runs on Express + MongoDB with stateful sessions (`connect-mongo`), while frontend is powered by React 18 + Vite.
   - Show `npm run dev` running on both servers.
2. **Experiment 9 & 10 (MongoDB Shell & Aggregations)**:
   - Run `npm run mongo:crud` in backend terminal to demonstrate `insertOne`, `insertMany`, `find` projection, `$set`, `$inc`, `$push`, and `deleteOne`.
   - Run `npm run mongo:advanced` to demonstrate compound indexing, text indexing, and 3 `$group` / `$unwind` aggregation pipelines (e.g., average stipend by mode, most in-demand skills).
3. **Experiment 2 (EJS Server-Side Rendering)**:
   - Open browser to `http://localhost:5000/about` to show public EJS SSR page passing variables.
   - Open `http://localhost:5000/admin` $\rightarrow$ login with `admin@internshield.com` / `Admin@123`.
   - Show dashboard counts, student scam reports table, and click "Approve" on a report to blacklist a fraudster using HTML form POST.
   - Show `http://localhost:5000/admin/internships/new` to show `application/x-www-form-urlencoded` form processing.
4. **Experiment 5 & 7 (React Class Components & Custom Hooks)**:
   - Open `http://localhost:5173/detector`.
   - Click "Load Scam Preset" $\rightarrow$ click "Analyze Trustworthiness".
   - Point out the circular `TrustMeter` and the nested `ClassTrustMeter` (showing `componentDidMount`, `componentDidUpdate`, and `state` synchronization).
   - Point out the 9-rule breakdown and click "Report This Recruiter" to show pre-filled route state passing.
5. **Experiment 4 & 7 (Resume Builder with `useReducer` & ATS Scoring)**:
   - Open `http://localhost:5173/resume`.
   - Click "Check ATS Score" to see keyword extraction.
   - Click "Tailor to JD" to watch `useReducer` reorder user skills & projects without inventing fake experience.
   - Click "Print / Save PDF" to show `@media print` cleanly isolating the A4 resume while hiding navigation and forms.
6. **Experiment 11 (Session Authentication, Recommendations & Cron Alerts)**:
   - Log in as student `aarav.sharma@college.edu` using the quick button.
   - Visit `/recommendations` to show verified jobs ranked with green (matched) and red (missing) skill badges.
   - Visit `/skillgap` to see role readiness progress bar and free external course links.
   - Visit `/alerts` to show notifications automatically dispatched by the background `node-cron` worker.
