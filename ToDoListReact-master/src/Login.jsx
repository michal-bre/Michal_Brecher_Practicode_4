import React, { useState } from "react";
import { Link } from "react-router-dom";
import service from "./service";
import "./register.css"; 

export default function Login() {
  const [form, setForm] = useState({ userName: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!form.userName.trim()) return setErr("נא להקליד שם משתמש");
    if (!form.password) return setErr("נא להקליד סיסמה");

    try {
      setLoading(true);
      await service.login(form.userName.trim(), form.password);
      window.location.href = "/";
    } catch {
      setErr("שם משתמש או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page" dir="rtl">
      <nav className="auth-nav">
        <Link to="/" className="nav-link">Todos</Link>
        <span className="sep">•</span>
        <span className="nav-link current">התחברות</span>
        <span className="sep">•</span>
        <Link to="/register" className="nav-link">הרשמה</Link>
      </nav>

      <div className="card">
        <h2 className="title">התחברות</h2>

        {err && <div className="alert">{err}</div>}

        <form onSubmit={handleSubmit} className="form">
          <label className="label">שם משתמש</label>
          <input
            className="input"
            placeholder="לדוגמה: michal_b"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
            autoComplete="username"
          />

          <label className="label row-between">
            <span>סיסמה</span>
            <button
              type="button"
              className="link-ghost"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "הסתר סיסמה" : "הצג סיסמה"}
            >
              {showPass ? "הסתר" : "הצג"}
            </button>
          </label>
          <input
            className="input"
            type={showPass ? "text" : "password"}
            placeholder="הקלד/י סיסמה"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>

        <p className="foot">
          אין לך חשבון?{" "}
          <Link to="/register" className="link-inline">להרשמה</Link>
        </p>
      </div>
    </div>
  );
}
