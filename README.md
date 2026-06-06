<p align="center">
  <img src="frontend/public/Remirind_Brand.png" alt="Remirind Banner" width="200" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Remirind-Task%20Manager-6366f1?style=for-the-badge&logo=checklist" alt="Remirind" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Cambria&size=34&duration=4000&color=6366F1&center=true&vCenter=true&width=1000&height=70&lines=REMIRIND+%7C+Production-Grade+Task+Management;Stay+Organized%2C+Stay+Productive" alt="Typing SVG" />
</p>

<h2 align="center">🚀 A production-ready task management platform built with the MERN stack.</h2>


<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-Apache%202.0-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Built%20With-React%20%7C%20Express%20%7C%20MongoDB-black?style=for-the-badge" />
</p>

---

# 📋 Remirind

> *Stay Organized, Stay Productive.*  
> **Remirind** is a full-stack task management platform built with production-quality engineering practices.  
> Designed with **React 19**, **Express.js**, **MongoDB**, and **Tailwind CSS** for speed, scale, and a polished UX.

---

# ✨ Features

- 🔐 **Authentication** — Register, login, and JWT-based protected routes with persistent sessions.
- 📝 **Task CRUD** — Create, read, update, and delete tasks with smart due date validation (no past dates).
- 📊 **Dashboard Analytics** — Real-time stats: total, pending, completed, high-priority, overdue, due today, due this week.
- 🔎 **Smart Filtering** — Filter by status, priority, and full-text search by title — all synced via URL params.
- 🎯 **Empty States** — Onboarding flow for new users; contextual messaging when filters yield no results.
- 🔔 **Toast Notifications** — Context-based toast system with auto-dismiss for every CRUD operation.
- ⏳ **Loading States** — Disabled buttons with spinners during async operations — no duplicate submissions.
- ⚠️ **Confirm Dialogs** — Custom modal dialog for destructive actions with backdrop blur and Escape support.
- 📱 **Responsive** — Mobile-friendly UI built with Tailwind CSS and shadcn/ui design principles.
- 🐳 **Docker** — Containerized deployment with Docker Compose for both production and development.

---

# 💡 Why This Project?

This platform demonstrates:

- **Clean Architecture**: Service layer separates business logic from controllers.
- **API Design**: Consistent REST patterns with centralized error handling.
- **UI/UX Focus**: Loading states, empty states, toast feedback, and confirm dialogs.
- **Code Quality**: Reusable UI primitives (`Button`, `StatCard`) with variants and loading support.
- **Validation**: Backend input validation via express-validator + frontend form guards.

---

# 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Language | JavaScript |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT, bcrypt |
| Validation | express-validator |
| Testing | Mocha, Chai, chai-http |
| Containerization | Docker, Docker Compose |
| UI Primitives | Custom Button & StatCard components |

---

# 📂 Project Structure

```plaintext
todo-list/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas (Task, User)
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Business logic
│   │   ├── utils/           # AppError, response helpers
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Entry point
│   └── tests/               # Mocha integration tests
├── frontend/
│   ├── public/              # Static assets (logo, favicon)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Reusable primitives (Button, StatCard)
│   │   │   ├── Navbar.jsx   # Sticky nav with logo + user menu
│   │   │   ├── Footer.jsx   # SaaS-style footer
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/           # Dashboard, Login, Register, NotFound
│   │   ├── hooks/           # useAuth, useTasks
│   │   ├── services/        # Axios API clients
│   │   ├── context/         # AuthContext, ToastContext
│   │   ├── routes/          # AppRoutes with protected routing
│   │   └── utils/           # Constants, helpers
│   └── ...config files
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── Dockerfile.frontend.dev
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

Open [http://localhost:3000](http://localhost:3000) and register a new account.

---

# 🐳 Docker Setup

### Production

```bash
docker compose up --build
```

App available at [http://localhost](http://localhost) (Nginx serving frontend, proxying API to backend).

### Development (with hot-reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

---

# 🔐 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-list
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

---

# 🧠 How It Works

1. **Register / Login**: Create an account or sign in to access your dashboard.
2. **Dashboard Overview**: View real-time stats — total tasks, pending, completed, high-priority, overdue, due today, and due this week.
3. **Create Tasks**: Click "Add Task" to open the modal — fill in title, description, priority, and due date.
4. **Manage Tasks**: Toggle completion, edit, or delete tasks directly from the task list.
5. **Filter & Search**: Use the filter bar to narrow tasks by status, priority, or search by title.
6. **Stay Notified**: Toast notifications confirm every action — success in green, errors in red.

---

# 📬 API Reference

Base URL: `http://localhost:5000/api`

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | `{ name, email, password }` | Register user |
| POST | `/auth/login` | `{ email, password }` | Login |
| GET | `/auth/me` | — | Get current user |

### Tasks (Bearer token required)

| Method | Endpoint | Query / Body | Description |
|--------|----------|--------------|-------------|
| GET | `/tasks/stats` | — | Dashboard stats (7 metrics) |
| POST | `/tasks` | `{ title, description?, priority?, dueDate? }` | Create task |
| GET | `/tasks` | `?status=&priority=&search=` | List / filter tasks |
| GET | `/tasks/:id` | — | Get task by ID |
| PUT | `/tasks/:id` | `{ title?, description?, priority?, status?, dueDate? }` | Update task |
| DELETE | `/tasks/:id` | — | Delete task |

### Response Format

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

---

# 🧪 Testing

```bash
cd backend
npm test
```

Tests cover:
- User registration (success, duplicate email)
- User login (valid, invalid password)
- Token verification
- Task CRUD (create, read, update, delete)
- Task filtering & stats

---

# 🚀 Roadmap

- [x] JWT authentication with register/login
- [x] Task CRUD with validation
- [x] Dashboard analytics (7 metric cards)
- [x] Smart filtering and search
- [x] Empty states and onboarding
- [x] Toast notification system
- [x] Confirm dialogs for destructive actions
- [x] Loading states and duplicate prevention
- [x] Docker production + dev setup
- [x] Reusable UI primitives (Button, StatCard)
- [ ] Dark mode toggle
- [ ] Task categories / tags
- [ ] Drag-and-drop task reordering
- [ ] Email reminders for due tasks

---

# 📈 Future Improvements

- Dark mode with Tailwind CSS class-based theming
- Task labels and custom categories
- Drag-and-drop kanban board view
- Email / push notifications for upcoming due dates
- Pagination for large task lists
- Share / assign tasks to other users

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

---

# ⭐ Support

If you liked this project:

```md
Give it a star ⭐
```
