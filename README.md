# Remirind

A production-ready task management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Authentication** — Register, login, JWT-based auth with protected routes
- **Task CRUD** — Create, read, update, and delete tasks with due date validation
- **Dashboard Analytics** — Real-time stats: total, pending, completed, high-priority, overdue, due today, due this week
- **Smart Filtering** — Filter by status, priority, and full-text search by title
- **Empty States** — Onboarding flow for new users; contextual messaging when filters yield no results
- **Toast Notifications** — Context-based toast system for all CRUD operations with auto-dismiss
- **Loading States** — Disabled buttons with spinners during async operations to prevent duplicate submissions
- **Confirm Dialogs** — Custom modal dialog for destructive actions (delete confirmation)
- **Responsive** — Mobile-friendly UI built with Tailwind CSS and shadcn/ui design principles
- **Docker** — Containerized deployment with Docker Compose

## Tech Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |
| Backend  | Node.js, Express.js, Mongoose      |
| Database | MongoDB                            |
| Auth     | JWT, bcrypt                        |
| Testing  | Mocha, Chai, chai-http             |
| DevOps   | Docker, Docker Compose             |

## Project Structure

```
todo-list/
├── backend/
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routers
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helpers & response helpers
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Entry point
│   └── tests/             # API tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/        # Reusable primitives (Button, StatCard)
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/         # Page-level components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # Axios API clients
│   │   ├── context/       # Auth & Toast context providers
│   │   ├── routes/        # Route definitions
│   │   └── utils/         # Constants & helpers
│   └── ...config files
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── nginx.conf
```

## Quick Start (Local)

### Prerequisites

- Node.js 20+
- MongoDB running locally on port 27017

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and register a new account.

## Docker Setup

```bash
# From the project root
docker compose up --build
```

The app will be available at [http://localhost](http://localhost) (frontend served by Nginx, API proxied to the backend).

For development with hot-reload:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## API Documentation

Base URL: `http://localhost:5000/api`

### Health Check

```
GET /health
```

### Auth

| Method | Endpoint         | Body                                  | Description      |
| ------ | ---------------- | ------------------------------------- | ---------------- |
| POST   | `/auth/register` | `{ name, email, password }`           | Register user    |
| POST   | `/auth/login`    | `{ email, password }`                 | Login            |
| GET    | `/auth/me`       | _Bearer token in Authorization header_ | Get current user |

### Tasks (all require Bearer token)

| Method | Endpoint         | Query / Body                              | Description           |
| ------ | ---------------- | ----------------------------------------- | --------------------- |
| GET    | `/tasks/stats`   | —                                         | Dashboard stats       |
| POST   | `/tasks`         | `{ title, description?, priority?, dueDate? }` | Create task      |
| GET    | `/tasks`         | `?status=&priority=&search=`              | List/filter tasks     |
| GET    | `/tasks/:id`     | —                                         | Get single task       |
| PUT    | `/tasks/:id`     | `{ title?, description?, priority?, status?, dueDate? }` | Update task |
| DELETE | `/tasks/:id`     | —                                         | Delete task           |

### Response Format

All responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Testing

```bash
cd backend
npm test
```

## Environment Variables

| Variable      | Default                  | Description                  |
| ------------- | ------------------------ | ---------------------------- |
| `PORT`        | `5000`                   | Backend server port          |
| `MONGODB_URI` | `mongodb://localhost:27017/todo-list` | MongoDB connection string |
| `JWT_SECRET`  | —                        | Secret key for JWT signing   |
| `JWT_EXPIRE`  | `7d`                     | Token expiration duration    |
| `NODE_ENV`    | `development`            | Environment mode             |

## Architecture Decisions

- **Service layer** separates business logic from controllers, keeping controllers thin and testable.
- **Consistent error handling** via a centralized error handler middleware and custom `AppError` class.
- **Express-validator** handles input validation before it reaches the controllers.
- **JWT stored in localStorage** with Axios interceptors that automatically attach the token and redirect on 401.
- **Vite proxy** in development forwards `/api` requests to the backend, avoiding CORS issues.
- **Docker multi-stage build** for the frontend produces a minimal Nginx image for production.
- **UI primitives** (`Button`, `StatCard`) provide consistent styling and loading states across the app.
- **Toast context** decouples notifications from component state, allowing any component to trigger toasts.
