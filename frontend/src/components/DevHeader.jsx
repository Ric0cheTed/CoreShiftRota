import React, { useState } from "react";
import api from "/src/services/api.js";

const btn = {
  padding: "4px 8px",
  background: "#374151",
  color: "#fff",
  border: "1px solid #4B5563",
  borderRadius: 6,
  cursor: "pointer",
};

export default function DevHeader() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(fn, label) {
    try {
      setBusy(true);
      setMsg(label + "…");
      await fn();
      setMsg(label + " ✅");

      // 🔔 tell all pages using useApi() to refresh
      window.dispatchEvent(new CustomEvent("data:refresh", { detail: { scope: "all" } }));

      setTimeout(() => setMsg(""), 1200);
    } catch (e) {
      console.error(e);
      setMsg(label + " ❌");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        background: "#111827",
        color: "#fff",
        padding: "6px 10px",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <strong>DEV</strong>
      <button disabled={busy} onClick={() => run(api.devLogin, "Dev login")} style={btn}>
        Dev Login
      </button>
      <button disabled={busy} onClick={() => run(api.devReset, "Reset")} style={btn}>
        Reset
      </button>
      <button disabled={busy} onClick={() => run(api.devSeed, "Seed")} style={btn}>
        Seed
      </button>
      <button
        disabled={busy}
        onClick={() => {
          localStorage.clear();
          location.reload();
        }}
        style={btn}
      >
        Logout
      </button>
      <span style={{ marginLeft: "auto", opacity: 0.85 }}>{msg}</span>
    </div>
  );
}
