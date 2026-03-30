import { useState, useMemo, useEffect } from "react";

const STORAGE_KEY = "test-tracker-tests";

/**
 * Application Test Tracker – Month Grid Calendar
 * ✅ Visual test ranges across multiple days
 * ✅ Start + End dates
 * ✅ Drag start date
 * ✅ Edit / Delete
 * ✅ Status & Environment badges
 * ✅ Week numbers
 * Application Test Tracker – Month Grid Calendar
 * ✅ Visual test ranges across multiple days
 * ✅ Start + End dates
 * ✅ Drag start date
 * ✅ Edit / Delete
 * ✅ Status & Environment badges
 * ✅ Week numbers
 */

/* ========================
   COLOUR CONFIG
======================== */
const STATUS_STYLES = {
  Planned: { background: "#eef2f6", color: "#334155" },
  "In Progress": { background: "#dbeafe", color: "#1d4ed8" },
  Blocked: { background: "#fee2e2", color: "#b91c1c" },
  Completed: { background: "#dcfce7", color: "#166534" },
};

const ENV_STYLES = {
  DEV: { background: "#e5e7eb", color: "#111827" },
  QA: { background: "#ffedd5", color: "#9a3412" },
  UAT: { background: "#ede9fe", color: "#5b21b6" },
  PROD: { background: "#dcfce7", color: "#166534" },
};

/* ========================
   STYLES
======================== */
const styles = {
  page: { fontFamily: "Segoe UI, Arial", background: "#f5f7fa", minHeight: "100vh", padding: 24 },
  container: { maxWidth: 1300, margin: "0 auto", background: "#fff", borderRadius: 8, padding: 24 },
  page: { fontFamily: "Segoe UI, Arial", background: "#f5f7fa", minHeight: "100vh", padding: 24 },
  container: { maxWidth: 1300, margin: "0 auto", background: "#fff", borderRadius: 8, padding: 24 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 600 },
  ghostButton: { padding: "4px 10px", border: "1px solid #cfd6df", borderRadius: 4, background: "#fff" },
  input: { padding: 8, border: "1px solid #cfd6df", borderRadius: 4 },
  button: { padding: "6px 12px", borderRadius: 6, background: "#005bb5", color: "#fff", border: "none" },
  ghostButton: { padding: "4px 10px", border: "1px solid #cfd6df", borderRadius: 4, background: "#fff" },
  input: { padding: 8, border: "1px solid #cfd6df", borderRadius: 4 },
  button: { padding: "6px 12px", borderRadius: 6, background: "#005bb5", color: "#fff", border: "none" },
  monthGrid: { display: "grid", gridTemplateColumns: "40px repeat(7, 1fr)", gap: 8 },
  weekCell: { fontSize: 11, textAlign: "center", color: "#666", paddingTop: 6 },
  dayCell: { minHeight: 120, padding: 6, border: "1px solid #e5e7eb", borderRadius: 6, background: "#fafbfc" },
  dayCell: { minHeight: 120, padding: 6, border: "1px solid #e5e7eb", borderRadius: 6, background: "#fafbfc" },
  weekend: { background: "#f0f2f5" },
  today: { border: "2px solid #005bb5" },
  dayHeader: { fontSize: 12, fontWeight: 600, marginBottom: 4 },
  rangePill: {
    marginBottom: 4,
    padding: "4px 6px",
    fontSize: 11,
    borderRadius: 6,
    display: "flex",
    justifyContent: "space-between",
  rangePill: {
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
    padding: "4px 6px",
    cursor: "pointer",
    fontSize: 11,
  },
    borderRadius: 6,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
  },
  badge: { fontSize: 10, padding: "2px 6px", borderRadius: 8, fontWeight: 600 },
};

/* ========================
   UTIL
   UTIL
======================== */
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function isDateInRange(day, start, end) {
  const d = day.toISOString().slice(0, 10);
  return d >= start && (!end || d <= end);
}


function isDateInRange(day, start, end) {
  const d = day.toISOString().slice(0, 10);
  return d >= start && (!end || d <= end);
}


/* ========================
   APP
======================== */
export default function App() {
  const [tests, setTests] = useState([]);
  const [form, setForm] = useState({ name: "", owner: "", startDate: "", endDate: "", environment: "QA", status: "Planned" });
  const [form, setForm] = useState({ name: "", owner: "", startDate: "", endDate: "", environment: "QA", status: "Planned" });
  const [currentMonth, setCurrentMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [currentMonth, setCurrentMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setTests(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  }, [tests]);

  const addTest = () => {
    if (!form.name || !form.startDate) return;
    setTests(prev => [...prev, { ...form, id: Date.now() }]);
    setForm({ name: "", owner: "", startDate: "", endDate: "", environment: "QA", status: "Planned" });
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const todayKey = new Date().toISOString().slice(0, 10);

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const offset = first.getDay();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const offset = first.getDay();
  const days = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>Application Test Tracker</div>
          <div>
            <button style={styles.ghostButton} onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>←</button>
            <strong style={{ margin: "0 12px" }}>{currentMonth.toLocaleString("default", { month: "long" })} {year}</strong>
            <button style={styles.ghostButton} onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>→</button>
          </div>
        </div>

        {/* Add Test */}
        <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <strong>Add Test</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginTop: 8 }}>
            <input style={styles.input} placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={styles.input} placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={styles.input} placeholder="Owner" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} />
            <input style={styles.input} type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            <input style={styles.input} type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            <select style={styles.input} value={form.environment} onChange={e => setForm({ ...form, environment: e.target.value })}>
              {Object.keys(ENV_STYLES).map(e => <option key={e}>{e}</option>)}
            </select>
            <select style={styles.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {Object.keys(STATUS_STYLES).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginTop: 8 }}><button style={styles.button} onClick={addTest}>Add</button></div>
          <div style={{ marginTop: 8 }}><button style={styles.button} onClick={addTest}>Add</button></div>
        </div>

        {/* Calendar */}
        <div style={styles.monthGrid}>
          <div></div>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>{d}</div>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>{d}</div>
          ))}


          {days.map((day, idx) => {
            if (!day) return <div key={idx}></div>;
            const key = day.toISOString().slice(0, 10);


          {days.map((day, idx) => {
            if (!day) return <div key={idx}></div>;
            const key = day.toISOString().slice(0, 10);
            const isToday = key === todayKey;
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            const isWeekStart = day.getDay() === 0;
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            const isWeekStart = day.getDay() === 0;
            const activeTests = tests.filter(t => isDateInRange(day, t.startDate, t.endDate));


            const activeTests = tests.filter(t => isDateInRange(day, t.startDate, t.endDate));


            return (
              <>
                {isWeekStart && <div key={`w-${key}`} style={styles.weekCell}>W{getISOWeek(day)}</div>}
                {isWeekStart && <div key={`w-${key}`} style={styles.weekCell}>W{getISOWeek(day)}</div>}
                <div
                  key={key}
                  style={{ ...styles.dayCell, ...(isWeekend ? styles.weekend : {}), ...(isToday ? styles.today : {}) }}
                  style={{ ...styles.dayCell, ...(isWeekend ? styles.weekend : {}), ...(isToday ? styles.today : {}) }}
                >
                  <div style={styles.dayHeader}>{day.getDate()}</div>
                  {activeTests.map(t => (
                    <div key={t.id}
                      style={{ ...styles.rangePill, ...STATUS_STYLES[t.status] }}
                      title={`${t.name} (${t.startDate} → ${t.endDate})`}
                  <div style={styles.dayHeader}>{day.getDate()}</d                  {activeTests.map(t => (
                    <div key={t.id}
                      sty                      <span style={{ ...styles.badge, ...ENV_STYLES[t.environment] }}>{t.environment}</span>le={{ ...styles.rangePill, ...STATUS_STYLES[t.status] }}
                      title={`${t.name} (${t.startDate} → ${t.endDate})`}
                                                          <span style={{ ...styles.badge, ...ENV_S                    </div>
                  ))}
                         </>
                   })}
        </div>
      </div>
    </div>
  );
}