# CoreShiftRota

Modern rota & shift coverage system for care companies (starting with Libra Support Services). Built with **FastAPI** (backend) and **React + Vite + Tailwind** (frontend).

## Repo layout

```
CoreShiftRota/
  backend/    # FastAPI app (Alembic, auth, dev tools, visits, clients, employees)
  frontend/   # React (Vite) app with auth, dashboard, rota views
```

## Quick start

### Prereqs
- Python 3.11+
- Node 20+ / PNPM or NPM
- Git

### 1) Backend (FastAPI)

```powershell
cd backend
python -m venv .venv
. .venv/Scripts/activate     # Windows PowerShell
pip install -U pip
pip install -r requirements.txt

# First run (create DB, run dev seed if available)
setx ALLOWED_DEV_LOGIN true
setx JWT_SECRET "dev-change-me"
setx CORS_ORIGINS "http://localhost:5173"
setx ENV "dev"

# If you use Alembic, run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# visit http://127.0.0.1:8000/docs
```

### 2) Frontend (Vite + React + Tailwind)

```powershell
cd frontend
# choose one:
npm install
# or
pnpm install

# Set env (create .env)
echo VITE_API_BASE=http://127.0.0.1:8000 > .env
echo VITE_DEV_MODE=true >> .env

# Start
npm run dev
# or
pnpm dev

# Vite dev server runs at http://127.0.0.1:5173
```

### Dev Mode UX
- Set `VITE_DEV_MODE=true` to enable auto-login and show the Dev Banner (if implemented).
- Backend should expose `/auth/dev-login`, `/dev/seed`, `/dev/reset` as part of the dev flow.

## Scripts & Useful Commands

### Backend
- `uvicorn app.main:app --reload --port 8000` – run API
- `alembic upgrade head` – run migrations
- `pytest` – run tests (if present)
- `python -m app.devtools` – seed/reset helpers (if present)

### Frontend
- `npm run dev` – start Vite
- `npm run build` – production build
- `npm run preview` – preview build

## Environment Variables

### Backend
- `JWT_SECRET` – JWT signing secret
- `ALLOWED_DEV_LOGIN` – allow `/auth/dev-login` (true/false)
- `CORS_ORIGINS` – comma-separated origins, e.g. `http://localhost:5173`
- `ENV` – `dev` or `prod`

### Frontend
- `VITE_API_BASE` – backend base URL
- `VITE_DEV_MODE` – enable dev tools in UI

## Deployment (starter)
- **Backend:** render.com / fly.io / Railway – build with `pip install -r requirements.txt`, run `uvicorn app.main:app`
- **Frontend:** Netlify/Vercel – set `VITE_API_BASE` to your deployed backend URL

## Git workflow

```powershell
# initial push
git init
git add .
git commit -m "Initial import: CoreShiftRota baseline"
git branch -M main
git remote add origin https://github.com/<YOU>/CoreShiftRota.git
git push -u origin main
```

## License
Proprietary – © Ric sandbox
