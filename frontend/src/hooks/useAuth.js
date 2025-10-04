// src/hooks/useAuth.js
import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role") || "user");

  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role") || "user");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return {
    token,
    role,
    isAuthed: !!token,
    isAdmin: role === "admin",
    isManager: role === "manager",
    isCarer: role === "carer",
  };
}
