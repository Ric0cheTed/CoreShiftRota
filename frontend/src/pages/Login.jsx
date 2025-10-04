import React, { useState } from "react";
import { devLogin, login } from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function onDevLogin() {
    setMsg("");
    try {
      await devLogin();
      window.location.href = "/dashboard"; // or your protected landing route
    } catch (e) {
      setMsg("Dev login failed");
      console.error(e);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      await login(username, password);
      window.location.href = "/dashboard";
    } catch (e) {
      setMsg("Invalid credentials");
      console.error(e);
    }
  }

  return (
    <div className="w-full flex items-center justify-center py-16">
      <form onSubmit={onSubmit} className="w-full max-w-md p-6 rounded border">
        <h1 className="text-2xl font-bold mb-4">CoreShift Login</h1>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>

        <button
          type="button"
          onClick={onDevLogin}
          className="w-full bg-red-600 text-white py-2 rounded mt-3"
        >
          Dev Login
        </button>

        {msg && <p className="text-red-600 mt-2">{msg}</p>}
      </form>
    </div>
  );
}
