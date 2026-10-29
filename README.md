<p align="center">
  <img src="frontend/public/Remirind_Brand.png" alt="Remirind Banner" width="200" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Remirind-Task%20%26%20Assessment%20Platform-6366f1?style=for-the-badge&logo=checklist" alt="Remirind" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Cambria&size=34&duration=4000&color=6366F1&center=true&vCenter=true&width=1000&height=70&lines=REMIRIND+%7C+Task+Management+%26+Online+Assessments;Stay+Organized%2C+Stay+Productive" alt="Typing SVG" />
</p>

<h2 align="center">🚀 A production-ready productivity and online examination platform built with the MERN stack.</h2>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-Apache%202.0-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Built%20With-React%20%7C%20Express%20%7C%20MongoDB-black?style=for-the-badge" />
</p>

---

# 📋 Remirind

> *Stay Organized, Stay Productive, Assess Your Knowledge.*  
> **Remirind** is a full-stack task management and online assessment platform built with production-quality engineering practices.  
> Designed with **React 19**, **Express.js**, **MongoDB**, and **Tailwind CSS** with a warm editorial UI aesthetic.

---

# ✨ Features

### 📝 Task & Deadline Management
- 🔐 **Authentication** — Register, login, and JWT-based protected routes with persistent sessions.
- 📋 **Task CRUD** — Create, read, update, and delete tasks with smart due date validation (no past dates).
- 📊 **Dashboard Analytics** — Real-time stats: total, pending, completed, high-priority, overdue, due today, due this week.
- 🔎 **Smart Filtering** — Filter by status, priority, and full-text search by title — all synced via URL params.
- 🎯 **Empty States** — Onboarding flow for new users; contextual messaging when filters yield no results.
- 🔔 **Toast Notifications** — Context-based toast system with auto-dismiss for every CRUD operation.
- ⏳ **Loading States** — Disabled buttons with spinners during async operations — no duplicate submissions.
- ⚠️ **Confirm Dialogs** — Custom modal dialog for destructive actions with backdrop blur and keyboard escape support.

### 🎓 Examination & Assessment Engine (Auspify / Pluto Task 6)
- 📝 **Online Tests** — Interactive test catalog (Web Dev, JavaScript Async, Full-Stack MERN) with duration, categories, and question count.
- ⏱️ **Distraction-Free Exam Interface** — Live countdown timer (with automated auto-submission upon timeout), interactive question navigation matrix, and unanswered alert confirmations.
- 🧮 **Automated Result Calculation** — Secure server-side grading calculating total score, accuracy percentage, pass/fail status, and time taken.
- 📊 **Performance & Score Reports** — Detailed report card with printable summary, score cards, and question-by-question review revealing answer keys & conceptual explanations only post-submission.
- 📜 **Exam History** — Historical log of all user test attempts with timestamps, scores, and status tags.
- 🛡️ **System Security & Anti-Cheat Protection** — Answer keys (`correctOption`) and explanations are strictly omitted from client responses during active test-taking.

---

# 💡 Why This Project?

This platform demonstrates:

- **Clean Architecture**: Service layer cleanly separates business logic from route controllers.
- **RESTful API Design**: Consistent response structure, HTTP status codes, and centralized error handling.
- **Security-First Evaluation**: Answer secrecy guaranteed at database-projection level.
- **UI/UX Focus**: Editorial design system with warm ivory surfaces (`#f7f4ec`), EB Garamond typography, and responsive layouts.
- **Code Quality**: Reusable UI primitives (`Button`, `StatCard`, `ConfirmDialog`) and modular custom hooks.
- **Validation**: Strict backend validation via `express-validator` paired with frontend defensive checks.

---

# 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router v6, Axios, Lucide Icons |
| Backend | Node.js, Express.js |
| Language | JavaScript (ES6+) |
| Database | MongoDB (Mongoose ODM) |
| Auth & Security | JWT (JSON Web Tokens), bcryptjs, express-validator |
| Testing | Mocha, Chai, cross-env |
| Containerization | Docker, Docker Compose, Nginx |

---

# 📂 Project Structure

```plaintext
todo-list/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Route handlers (auth, task, exam)
│   │   ├── middleware/      # Auth, validation, errorHandler
│   │   ├── models/          # Mongoose models (User, Task, Exam, ExamResult)
│   │   ├── routes/          # Express routers (authRoutes, taskRoutes, examRoutes)
│   │   ├── seeds/           # Seed runner & default examination questions
│   │   ├── services/        # Business logic (taskService, examService)
│   │   ├── utils/           # AppError, response helpers
│   │   ├── app.js           # Express app setup & middleware pipeline
│   │   └── server.js        # Server entry point + auto seed runner
│   └── tests/               # Mocha security and integration tests
├── frontend/
│   ├── public/              # Static brand assets
│   ├── src/
│   │   ├── components/      # Navbar, Footer, TaskCard, TaskModal, ConfirmDialog, etc.
│   │   ├── context/         # AuthContext, ToastContext
│   │   ├── hooks/           # useAuth, useTasks
│   │   ├── pages/           # Dashboard, Login, Register, ExamList, ExamTake, ExamReport, ExamHistory
│   │   ├── routes/          # AppRoutes with ProtectedRoute & PublicRoute
│   │   └── services/        # Axios API clients (authService, taskService, examService)
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── nginx.conf
```

---

# ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/Cipher-Shadow-IR/Remirind.git

# Enter folder
cd Remirind
```

---

# ▶️ Run Locally

### Prerequisites

- Node.js 20+
- MongoDB running locally on port 27017

### 1. Configure Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2. Configure Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the Vite dev URL) and register an account.

---

# 🐳 Docker Setup

### Production (Full Stack with Nginx reverse proxy)

```bash
docker compose up --build
```

The app will be available at [http://localhost](http://localhost).
- Frontend served via Nginx on port 80
- API requests automatically reverse-proxied to Express on port 5000
- MongoDB running on port 27017

---

# 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-list
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
# Leave empty or omit in production/Docker to use relative reverse proxy
VITE_API_URL=
```

---

# 📬 API Reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |
| GET | `/auth/me` | Fetch authenticated user profile |

### Tasks (Bearer token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks/stats` | Dashboard statistics (total, pending, completed, overdue, etc.) |
| POST | `/tasks` | Create a new task |
| GET | `/tasks` | List & filter tasks (`?status=&priority=&search=`) |
| GET | `/tasks/:id` | Get task by ID |
| PUT | `/tasks/:id` | Update task details |
| DELETE | `/tasks/:id` | Delete task |

### Examinations & Assessments (Bearer token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/exams` | List all active tests (without questions/answers) |
| GET | `/exams/:id/take` | Fetch exam for taking (**Answer keys & explanations stripped**) |
| POST | `/exams/:id/submit` | Submit answers, calculate score & get graded report |
| GET | `/exams/results/my` | Get current user's past exam attempts and scores |
| GET | `/exams/results/:resultId` | Get detailed score report and question review |

---

# 🧪 Testing & Security Verification

```bash
cd backend
npm test
```

The automated security and functionality test suite covers:
- **Answer Security**: Asserts that `correctOption` and `explanation` are strictly never sent to students before submission.
- **Input Validation**: Verifies rejection of invalid IDs, unauthenticated requests, and malformed submission arrays.
- **Grading Engine**: Tests 100% scores, partial scores, unanswered question penalties, and post-submission review generation.

---

# 📜 License

Apache License 2.0

---

## 💬 Author

<p align="center">
  <b>Built by Ishaan Ray (Cipher Shadow IR)</b><br>
  <i>"Stay Organized, Stay Productive."</i><br><br>
  <a href="https://github.com/Cipher-Shadow-IR" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Cipher%20Shadow%20IR-181717?style=for-the-badge&logo=github" />
  </a>
</p>
