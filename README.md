# LearnSphere 🎓

**Learn anything. Teach everything. Your knowledge, your terms.**

🔗 [Live Demo](https://your-vercel-url.vercel.app)

LearnSphere is a full-stack EdTech platform where learners can discover and enroll in courses, and instructors can create and manage their course offerings — all powered by a modern React frontend and a robust Node.js/TypeScript backend.

---

## ✨ Features

- **Student Features**
  - Browse and enroll in courses via Razorpay payment integration
  - Watch lecture videos with a built-in video player
  - Read PDF study materials via Google Drive API
  - Track course progress
  - Rate and review courses

- **Instructor Features**
  - Create, edit, and manage courses with sections & sub-sections
  - Upload video lectures (Cloudinary) and PDF resources (Google Drive)
  - View instructor dashboard with earnings and student stats

- **General**
  - JWT-based authentication (signup, login, OTP email verification, forgot password)
  - Dark-themed, responsive UI with Framer Motion animations
  - Course catalog with category filtering
  - Contact form
  - Swagger API documentation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit, Framer Motion |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB Atlas (Mongoose) |
| Media Storage | Cloudinary (images/videos), Google Drive API (PDFs) |
| Payments | Razorpay |
| Email | Nodemailer (SMTP) |
| API Docs | Swagger (swagger-autogen + swagger-ui-express) |

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- MongoDB Atlas account
- Cloudinary account
- Google Cloud Service Account (for Drive API)
- Razorpay account

### 1. Clone the Repository

```bash
git clone https://github.com/nasarwaljatin/LearnSphere.git
cd LearnSphere
```

### 2. Setup Frontend

```bash
# Install dependencies
npm install

# Create your env file
cp .env.example .env
# Fill in VITE_BASE_URL with your backend URL

# Start dev server
npm run dev
```

### 3. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create your env file
cp .env.example .env
# Fill in all variables (see Environment Variables section)

# Start backend in dev mode
npm run dev
```

---

## 🔐 Environment Variables

### Frontend (`/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_BASE_URL` | Backend API base URL (e.g. `https://your-render-url.onrender.com/api/v2`) |

### Backend (`/server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `4000`) |
| `MONGO_URL` | MongoDB Atlas connection string |
| `MAIL_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `MAIL_USER` | SMTP email address |
| `MAIL_PASS` | SMTP app password |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLOUDINARY_FOLDER_NAME` | Cloudinary upload folder name |
| `CLOUD_NAME` | Cloudinary cloud name |
| `API_KEY` | Cloudinary API key |
| `API_SECRET` | Cloudinary API secret |
| `RAZORPAY_KEY` | Razorpay key ID |
| `RAZORPAY_SECRET` | Razorpay key secret |
| `SCOPE` | Google API scope (`https://www.googleapis.com/auth/drive`) |
| `CLIENT_MAIL` | Google service account email |
| `PRIVATE_KEY` | Google service account private key |
| `GOOGLE_DRIVE_FOLDER` | Google Drive folder ID for PDF uploads |
| `BASE_URL` | Frontend URL (for CORS, e.g. `https://your-app.vercel.app`) |
| `NODE_ENV` | `production` or `development` |
| `SERVER_URL` | Backend public URL (for Swagger docs) |

---

## 🌐 Deployment

### Frontend → Vercel

| Setting | Value |
|---------|-------|
| Framework Preset | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variable | `VITE_BASE_URL=https://your-render-backend-url.onrender.com/api/v2` |

> After deploying, copy your Vercel URL and set it as `BASE_URL` in your Render backend environment.

### Backend → Render

| Setting | Value |
|---------|-------|
| Root Directory | `server` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Environment Variables | All variables from `/server/.env.example` |

---

## 📁 Folder Structure

```
LearnSphere/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── assets/              # Images, logos
│   ├── components/
│   │   ├── common/          # Navbar, Footer, shared UI
│   │   └── core/            # Feature-specific components
│   ├── data/                # Static data (nav links, footer links)
│   ├── pages/               # Route-level page components
│   ├── reducer/             # Redux store setup
│   ├── services/            # API endpoints + connector
│   ├── slices/              # Redux slices
│   └── utils/               # Utility helpers
├── server/
│   └── src/
│       ├── config/          # DB, Cloudinary, Drive, env config
│       ├── controllers/     # Route handler logic
│       ├── middlewares/     # Auth, rate limiting
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express route definitions
│       ├── mail/            # Email templates
│       ├── types/           # TypeScript type definitions
│       ├── utils/           # Helper utilities
│       ├── swagger.js       # Swagger doc generation script
│       └── index.ts         # Express app entry point
├── .env.example             # Frontend env template
├── vercel.json              # Vercel SPA rewrite config
└── vite.config.js           # Vite build config
```

---

## 📄 License

MIT
