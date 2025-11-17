import React, { useState } from "react";
import { Link } from "react-router-dom";
import service from "./service";
import "./register.css"; // 👈 חשוב

export default function Register() {
  const [form, setForm] = useState({ userName: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const passStrength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Zא-ת]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s; // 0..4
  })();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!form.userName.trim()) return setErr("נא להקליד שם משתמש");
    if (form.password.length < 6) return setErr("סיסמה חייבת להיות באורך 6 תווים לפחות");

    try {
      setLoading(true);
      await service.register(form.userName.trim(), form.password);
      window.alert("נרשמת בהצלחה!");
      window.location.href = "/login";
    } catch {
      setErr("שם משתמש כבר קיים");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page" dir="rtl">
      <nav className="auth-nav">
        <Link to="/" className="nav-link">Todos</Link>
        <span className="sep">•</span>
        <Link to="/login" className="nav-link">התחברות</Link>
        <span className="sep">•</span>
        <span className="nav-link current">הרשמה</span>
      </nav>

      <div className="card">
        <h2 className="title">הרשמה</h2>

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
            placeholder="מינימום 6 תווים"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
          />

          {/* פס חוזק סיסמה */}
          <div className="strength">
            <div className={`bar ${passStrength >= 1 ? "on" : ""}`} />
            <div className={`bar ${passStrength >= 2 ? "on" : ""}`} />
            <div className={`bar ${passStrength >= 3 ? "on" : ""}`} />
            <div className={`bar ${passStrength >= 4 ? "on" : ""}`} />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "נרשם..." : "הרשם"}
          </button>
        </form>

        <p className="foot">
          כבר יש לך משתמש? <Link to="/login" className="link-inline">למסך ההתחברות</Link>
        </p>
      </div>
    </div>
  );
}
