import React, { useState } from "react";
import api from "../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.role);
      window.location.reload();
    } catch {
      setError("Login failed");
    }
  };

  const handleDevLogin = () => {
  localStorage.setItem("token", "demo-token");
  localStorage.setItem("role", "admin");
  window.location.reload();
};


  return (
    <div style={{ padding: "50px" }}>
      <h2>CoreShift Login</h2>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleDevLogin}>Dev Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;