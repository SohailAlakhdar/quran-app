# رحلة القرآن — Quran Learning App

A full-stack Quran learning platform for children aged 10–15: memorization and tadabbur (reflection) practice through multiple-choice quizzes, with stars, achievements, and progress tracking. Includes a full admin dashboard for managing surahs, questions, and children.

## Features

**Child experience**
- Sign up / log in with just a first name + password (no unnecessary personal data collected)
- Browse surahs, search by name, filter by juz
- Two training modes per surah: memorization (حفظ) and tadabbur/meanings (التدبر والمعاني)
- Multiple-choice quizzes with instant, encouraging feedback ("أحسنت! 🌟" / "اقتربت! 💪")
- Stars for correct answers, final score screen, full answer review
- Progress tracking (per training type, completed surahs, averages)
- Achievements that unlock automatically based on activity
- Fully responsive, Arabic RTL interface (Bootstrap 5 + Cairo/Tajawal fonts)

**Admin experience**
- Separate admin login
- Full CRUD for questions (with filtering, search, and pagination)
- Full CRUD for surahs, including the per-surah quiz question count
- View/search paginated list of children with their stats
- Platform-wide statistics dashboard

**Security**
- JWT authentication, bcrypt password hashing, passwords never returned by the API
- Public signup can only create "child" accounts — never admin
- `correctAnswer` is never sent to the client until *after* they submit an answer
- Server-side random question selection via MongoDB `$sample` (never trust the frontend for randomization)
- Ownership checks on every quiz action (a child can only see/answer their own quiz)
- Rate limiting on auth endpoints, Helmet, CORS restricted to the configured client URL, centralized input validation and error handling

## Technology stack

- **Frontend:** Angular 19 (standalone components), TypeScript, Bootstrap 5 (RTL), Bootstrap Icons, RxJS, Angular Router, Reactive Forms
- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs, express-validator, Helmet, CORS, Morgan, express-rate-limit, compression, cookie-parser

> Note: `bcryptjs` (pure JavaScript) is used instead of `bcrypt` to avoid native-module compilation issues across environments. It's a drop-in, equally secure alternative for this use case.

## Folder structure

```
project/
├── client/                 # Angular frontend
│   └── src/app/
│       ├── core/            # guards, interceptors, services, models
│       ├── shared/          # reusable components (loading, toast, cards)
│       ├── layout/          # navbar, admin sidebar
│       └── features/        # auth, dashboard, surahs, quiz, results,
│                             # review, progress, achievements, profile,
│                             # admin/*
├── server/                 # Express backend
│   └── src/
│       ├── config/           # db connection
│       ├── controllers/      # route handlers
│       ├── middleware/       # auth, admin, validation, error handling
│       ├── models/           # Mongoose schemas
│       ├── routes/           # Express routers
│       ├── services/         # quiz engine, achievement engine
│       ├── validators/       # express-validator rules
│       ├── utils/            # jwt helpers, response formatting
│       └── seed/             # database seed script
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- A MongoDB instance (local `mongod`, Docker, or MongoDB Atlas)

## Installation & setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, etc.
```

`.env` variables:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/quran-learning
JWT_SECRET=your_secret_key_change_this
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4200
```

Seed the database (creates demo surahs, sample questions, achievements, and an admin account):

```bash
npm run seed
```

Start the API in development mode (auto-reload via nodemon):

```bash
npm run dev
```

The API will run at `http://localhost:3000/api`. Health check: `GET /api/health`.

**Seeded admin login:** firstName `Admin`, password `Admin@1234` (change this before any real deployment).

> ⚠️ The seeded questions are clearly marked `[نموذج]` / "[سؤال تجريبي]" — they are placeholder/demo content only, meant to exercise the quiz engine and random-selection logic. Replace them with content reviewed by a qualified admin or sourced from a trusted, verified Quran resource before real use.

### 2. Frontend

```bash
cd client
npm install
ng serve
```

The app will be available at `http://localhost:4200`. It talks to the API via `client/src/environments/environment.ts` (`apiUrl: 'http://localhost:3000/api'`) — update this (and `environment.prod.ts`) if your API runs elsewhere.

### 3. Production build

```bash
cd client
ng build --configuration production
```

Output is written to `client/dist/client`; serve it with any static file host (behind the same CORS-allowed origin configured in the backend's `CLIENT_URL`).

## API overview

All responses follow `{ success, message, data }` (or `{ success: false, message, errors }` on failure).

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create a child account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user (auth required) |
| POST | `/api/auth/logout` | Logout (stateless) |
| GET | `/api/surahs` | List surahs |
| GET | `/api/surahs/:id` | Surah details |
| GET | `/api/questions` | Child-facing questions (no `correctAnswer`) |
| POST | `/api/quizzes/start` | Start a quiz (random question selection) |
| POST | `/api/quizzes/:quizId/answer` | Submit an answer |
| GET | `/api/quizzes/:quizId/result` | Quiz result |
| GET | `/api/quizzes/:quizId/review` | Full answer review |
| GET | `/api/progress` | Current user's progress |
| GET | `/api/achievements` | Achievements + unlocked status |
| POST/PUT/DELETE | `/api/admin/surahs[/:id]` | Manage surahs (admin) |
| GET/POST/PUT/DELETE | `/api/admin/questions[/:id]` | Manage questions (admin) |
| GET | `/api/admin/users` | Paginated children list (admin) |
| GET | `/api/admin/statistics` | Platform statistics (admin) |

## Development commands

```bash
# Backend
cd server
npm install
npm run dev      # start with nodemon
npm run seed      # seed the database

# Frontend
cd client
npm install
ng serve          # dev server on :4200
ng build --configuration production
```

## Notes & known limitations

- The random question selection uses MongoDB's `$sample` aggregation stage, run entirely server-side.
- `averageScore` on the User model is recomputed from all completed quizzes each time a quiz finishes, so it always reflects an accurate running average.
- This project was built and verified in a sandboxed environment without a live MongoDB instance available; the backend was syntax-checked, dependency-installed, and smoke-tested (Express app boot + route wiring), and core logic (Mongoose validation, bcrypt hashing) was unit-tested directly. The frontend was scaffolded with the real Angular CLI and successfully completed a production build (`ng build --configuration production`) with zero compile errors. Full end-to-end testing against a live database is recommended before deployment.
