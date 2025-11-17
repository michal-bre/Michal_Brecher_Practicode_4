import React, { useEffect, useState } from "react";
import service from "./service.js";
import { Link } from "react-router-dom";
import "./app.css"; // 👈 עיצוב

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const completedCount = todos.filter(t => t.isComplete).length;

  async function getTodos() {
    try {
      const tasks = await service.getTasks();
      setTodos(tasks);
    } catch {
      console.error("failed to load todos");
    }
  }

  async function createTodo(e) {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    await service.addTask(newTodo.trim());
    setNewTodo("");
    await getTodos();
  }

  async function updateCompleted(todo, isComplete) {
    try {
      await service.setCompleted(todo.id, isComplete, todo.name);
      await getTodos();
    } catch (err) {
      console.error("update failed", err);
    }
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="page" dir="rtl">
      <nav className="topnav">
        <div className="brand">
          <span className="logo">📝</span>
          <span className="brand-title">TickDone</span>
        </div>
        <div className="links">
          <Link to="/" className="nav-link current">Todos</Link>
          <span className="dot">•</span>
          <Link to="/login" className="nav-link">Login</Link>
          <span className="dot">•</span>
          <Link to="/register" className="nav-link">Register</Link>
        </div>
      </nav>

      <main className="wrap">
        <section className="card">
          <header className="header">
            <h1 className="title">המשימות שלי</h1>
            <div className="stats">
              <span className="pill">סה״כ: {todos.length}</span>
              <span className="pill success">בוצעו: {completedCount}</span>
            </div>
            <form onSubmit={createTodo} className="addrow">
              <input
                className="input"
                placeholder="מה צריך לעשות היום?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <button className="btn">הוספה</button>
            </form>
          </header>

          {todos.length === 0 ? (
            <div className="empty">
              <div className="empty-emoji">🌤️</div>
              <div className="empty-title">אין משימות כרגע</div>
              <div className="empty-sub">כתבי למעלה והוסיפי את המשימה הראשונה שלך</div>
            </div>
          ) : (
            <section className="main">
              <ul className="todo-list">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className={`todo ${todo.isComplete ? "done" : ""}`}
                  >
                    <label className="todo-row">
                      <input
                        className="chk"
                        type="checkbox"
                        checked={todo.isComplete}
                        onChange={(e) => updateCompleted(todo, e.target.checked)}
                      />
                      <span className="todo-name">{todo.name}</span>
                    </label>
                    <button
                      className="del"
                      title="מחק"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
