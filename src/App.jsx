import { useState, useMemo, useEffect } from "react";

/* =========================================
   CONFIG
========================================= */
const STORAGE_KEY = "test-tracker-tests";

/* Status colours */
const STATUS_STYLES = {
  Planned: { background: "#eef2f6", color: "#334155" },
  "In Progress": { background: "#dbeafe", color: "#1d4ed8" },
  Blocked: { background: "#fee2e2", color: "#b91c1c" },
  Completed: { background: "#dcfce7", color: "#166534" },
};

/* Environment colours */
const ENV_STYLES = {
  DEV: { background: "#e5e7eb", color: "#111827" },
  QA: { background: "#ffedd5", color: "#9a3412" },
  UAT: { background: "#ede9fe", color: "#5b21b6" },
  PROD: { background: "#dcfce7", color: "#166534" },
};

/* =========================================
   STYLES
========================================= */
const styles = {
  page: {
    fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
    background: "#f5f7fa",
    minHeight: "100vh",
    padding: 24,
  },
  container: {
    maxWidth: 1300,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: 600 },
  ghostButton: {
    padding: "4px 10px",
    border: "1px solid #cfd6df",
    borderRadius: 4,
    background: "#fff",
    cursor: "pointer",
  },
  button: {
    padding: "8px 14px",
    borderRadius: 6,
    border: "1px solid #cfd6df",
    background: "#005bb5",
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  dangerButton: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #fecaca",
    background: "#fee2e2",
    color: "#991b1b",
    cursor: "pointer",
  },
  input: {
    padding: "8px",
    border: "1px solid #cfd6df",
    borderRadius: 4,
    fontSize: 14,
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
    fontSize: 12,
  },
  legendItem: {
    display: "flex",
    gap: 6,
    padding: "4px 8px",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    background: "#f9fafb",
  },
  badge: {
    fontSize: 10,
    padding: "2px 6px",
    borderRadius: 8,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  monthGrid: {
    display: "grid",
    gridTemplateColumns: "40px repeat(7, 1fr)",
    gap: 8,
  },
  weekCell: {
    fontSize: 11,
    textAlign: "center",
    color: "#666",
    paddingTop: 6,
  },
  dayCell: {
    border: "1px solid #e1e6eb",
    borderRadius: 6,
    padding: 8,
    minHeight: 120,
    background: "#fafbfc",
    display: "flex",
    flexDirection: "column",
  },
  weekend: { background: "#f0f2f5" },
  today: { border: "2px solid #005bb5" },
  dayHeader: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 4,
  },
  pill: {
    fontSize: 11,
    borderRadius: 6,
    padding: "4px 6px",
    marginBottom: 4,
    cursor: "move",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    borderRadius: 8,
    padding: 16,
    width: 420,
  },
};

/* =========================================
   UTIL
========================================= */
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/* =========================================
   APP
========================================= */
export default function App() {
  const [tests, setTests] = useState([]);
  const [editing, setEditing] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  /* Load / Save */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setTests(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  }, [tests]);

  const [form, setForm] = useState({
    name: "",
    owner: "",
    date: "",
    environment: "QA",
    status: "Planned",
  });

  const addTest = () => {
    if (!form.name || !form.date) return;
    setTests((prev) => [...prev, { ...form, id: Date.now() }]);
    setForm({ name: "", owner: "", date: "", environment: "QA", status: "Planned" });
  };

  /* Calendar */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const todayKey = new Date().toISOString().slice(0, 10);

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const offset = monthStart.getDay();

  const days = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= monthEnd.getDate(); d++) days.push(new Date(year, month, d));

  const testsByDay = useMemo(() => {
    return tests.reduce((acc, t) => {
      acc[t.date] = acc[t.date] || [];
      acc[t.date].push(t);
      return acc;
    }, {});
  }, [tests]);

  const onDragStart = (e, id) => e.dataTransfer.setData("text/plain", id);
  const onDrop = (e, date) => {
    const id = Number(e.dataTransfer.getData("text/plain"));
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, date } : t)));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>Application Test Tracker</div>
          <div>
            <button style={styles.ghostButton} onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>←</button>
            <strong style={{ margin: "0 12px" }}>
              {currentMonth.toLocaleString("default", { month: "long" })} {year}
            </strong>
            <button style={styles.ghostButton} onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>→</button>
          </div>
        </div>

        {/* Legend */}
        <div style={styles.legend}>
          <strong>Legend</strong>
          {Object.entries(STATUS_STYLES).map(([k,v]) => (
            <div key={k} style={styles.legendItem}>
              <span style={{...styles.badge, ...v}}>{k}</span>
            </div>
          ))}
          {Object.entries(ENV_STYLES).map(([k,v]) => (
            <div key={k} style={styles.legendItem}>
              <span style={{...styles.badge, ...v}}>{k}</span>
            </div>
          ))}
        </div>

        {/* Add Test */}
        <div style={{ marginBottom: 24 }}>
          <strong>Add Test</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 8 }}>
            <input style={styles.input} placeholder="Test name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={styles.input} placeholder="Owner" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} />
            <input style={styles.input} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <select style={styles.input} value={form.environment} onChange={e => setForm({ ...form, environment: e.target.value })}>
              {Object.keys(ENV_STYLES).map(e => <option key={e}>{e}</option>)}
            </select>
            <select style={styles.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {Object.keys(STATUS_STYLES).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <button style={styles.button} onClick={addTest}>Add Test</button>
          </div>
        </div>

        {/* Calendar */}
        <div style={styles.monthGrid}>
          <div></div>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} style={{ fontWeight: 600, fontSize: 12, textAlign: "center" }}>{d}</div>
          ))}
          {days.map((date, idx) => {
            if (!date) return <></>;
            const key = date.toISOString().slice(0,10);
            const isToday = key === todayKey;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isWeekStart = date.getDay() === 0;

            return (
              <>
                {isWeekStart && <div style={styles.weekCell}>W{getISOWeek(date)}</div>}
                <div
                  key={key}
                  style={{
                    ...styles.dayCell,
                    ...(isWeekend ? styles.weekend : {}),
                    ...(isToday ? styles.today : {})
                  }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => onDrop(e, key)}
                  onClick={() => setForm({ ...form, date: key })}
                >
                  <div style={styles.dayHeader}>{date.getDate()}</div>
                  {(testsByDay[key] || []).map(t => (
                    <div
                      key={t.id}
                      style={{...styles.pill, ...STATUS_STYLES[t.status]}}
                      draggable
                      onDragStart={e => onDragStart(e, t.id)}
                      onClick={e => { e.stopPropagation(); setEditing(t); }}
                    >
                      <span>{t.name}</span>
                      <span style={{...styles.badge, ...ENV_STYLES[t.environment]}}>{t.environment}</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {editing && (
        <div style={styles.modalBackdrop} onClick={() => setEditing(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <strong>Edit Test</strong>
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              <input style={styles.input} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              <input style={styles.input} value={editing.owner} onChange={e => setEditing({ ...editing, owner: e.target.value })} />
              <input style={styles.input} type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} />
              <select style={styles.input} value={editing.environment} onChange={e => setEditing({ ...editing, environment: e.target.value })}>
                {Object.keys(ENV_STYLES).map(e => <option key={e}>{e}</option>)}
              </select>
              <select style={styles.input} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                {Object.keys(STATUS_STYLES).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <button
                style={styles.button}
                onClick={() => {
                  setTests(prev => prev.map(t => t.id === editing.id ? editing : t));
                  setEditing(null);
                }}
              >
                Save
              </button>
              <button
                style={styles.dangerButton}
                onClick={() => {
                  setTests(prev => prev.filter(t => t.id !== editing.id));
                  setEditing(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}