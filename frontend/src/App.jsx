// src/App.jsx
import React/*, { useEffect }*/ from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Sidebar from "./components/Sidebar";
import DevHeader from "./components/DevHeader";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Employees from "./pages/Employees";
import Visits from "./pages/Visits";
import VisitForm from "./pages/VisitForm";
import VisitDetail from "./pages/VisitDetail";
import ClientDetail from "./pages/ClientDetail";
import EmployeeDetail from "./pages/EmployeeDetail";
import Audit from "./pages/Audit";
import RotaGrid from "./pages/rota/RotaGrid";

// If you prefer eager dev-login at app start, you can import:
// import { devLogin } from "./services/api.js";

function isAuthed() {
  try {
    return !!localStorage.getItem("token");
  } catch {
    return false;
  }
}

function AppShell() {
  const location = useLocation();
  const devMode = import.meta.env.VITE_DEV_MODE === "true";
  const authed = isAuthed();

  // Optional: eager dev-login. Your API layer already auto-ensures tokens on first request,
  // so this is not strictly necessary. Uncomment if desired.
  //
  // useEffect(() => {
  //   if (devMode && !authed) {
  //     devLogin().catch(console.error);
  //   }
  // }, [devMode, authed]);

  return (
    <>
      {devMode && <DevHeader />}
      <div className="flex">
        {authed && <Sidebar />}
        <div className="flex-1 p-4">
          {/* ErrorBoundary "keyed" by pathname so it resets per route */}
          <ErrorBoundary key={location.pathname}>
            <Routes>
              {/* Unauthenticated users always go to Login */}
              {!authed ? (
                <Route path="*" element={<Login />} />
              ) : (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/:id" element={<ClientDetail />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/employees/:id" element={<EmployeeDetail />} />
                  <Route path="/visits" element={<Visits />} />
                  <Route path="/visits/new" element={<VisitForm />} />
                  <Route path="/visits/:id" element={<VisitDetail />} />
                  <Route path="/audit" element={<Audit />} />
                  <Route path="/rota" element={<RotaGrid />} />
                  {/* Default when authed */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
              )}
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
