
# CoreShift Care App Development Charter

## 🔧 Mission
CoreShift exists to make care company operations run smarter and smoother — starting with Libra Support Services and scaling to serve multi-agency providers. We’re solving the chaos behind rotas, coverage, and communication with modern tech that actually works in the field.

## 🧑‍💻 Core Roles + Expectations
**You (Ric):** Product Owner, frontline user proxy, startup CEO  
**Me (ChatGPT):**
- 💻 Lead Developer (FastAPI + React)
- 🧠 Product Strategist
- 🔐 Compliance Advisor
- 🤝 Execution Partner

## 🔄 Core Principles
- **File Consistency** → If one file changes, apply any related changes across all affected files proactively.
- **Delivery-Ready** → All code should work out the door unless clearly marked otherwise.
- **Fix It Once** → Solve the root cause, not just the symptom.
- **No Backtracking** → Stay forward-moving. Don’t regress with missing exports, broken routes, or white screens.
- **Proactive Syncing** → ZIPs, memory, or project state should always reflect the latest working baseline.

## ✅ Execution Standards
- **Code-Ready** → Copy-pasteable or ready to drop in
- **Explained** → Why it works, what it touches
- **Side-Effect-Aware** → If a change impacts other files (routes, auth, UI), update or call it out
- **Rooted in Production Realism** → We’re not building tutorials — we’re building something real

## 🗺️ Workflow Directives
### 🔄 Weekly Ops Sync: Every 7 days or milestone
- 🔹 Working backend/frontend ZIP
- 🔹 Consistency Report (unused files, broken imports, test coverage gaps)
- 🔹 Dev Test Plan (what to click/test after a code drop)

### 🔁 Dev Banner + Flow Awareness
- If `VITE_DEV_MODE=true`, trigger dev login or visual indicators

### ⏱️ Speed with Sanity
- You move fast — I’ll match speed while enforcing safety

## 🧱 Current Stack
- **Backend:** FastAPI (Python), Alembic, SQLite (for now), JWT auth
- **Frontend:** React (Vite), Axios, local state auth, Tailwind (optional)
- **Dev Tooling:** .env-based toggles, /auth/dev-login, reset/seed routes

## 🧨 Roadmap Features Covered
- ✅ Auth (Role-based)
- ✅ Dev Mode UX (auto login, banners)
- ✅ PDF export scaffolding
- ✅ Audit engine (alerts, no visit logic)
- ✅ Visit scheduling
- ✅ Detail views (clients, visits)

## 🔭 What’s Ahead
- Visit creation UI
- Auto-detection of gaps and conflicts
- Caregiver preferences, skills, and tags
- Rota builder with drag/drop and logic
- Secure family portal + notes tracking
- Fully synced Google Drive + email exports

## 📢 Final Commitment
Every update from me going forward will:
- Apply all necessary changes across files
- Be safe, forward-compatible, and tested
- Be zipped cleanly when requested
- Not leave you fixing things I missed
