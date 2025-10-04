import React, { useMemo, useState } from "react";
import useApi from "../../hooks/useApi.js";

/** ---------- tiny date helpers (kept local to avoid new files) ---------- */
function toISODate(d) { return new Date(d).toISOString().slice(0, 10); }
function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function startOfWeek(date, weekStartsOn = 1 /* Mon */) {
  const d = new Date(date);
  const day = (d.getDay() + 7 - weekStartsOn) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0,0,0,0);
  return d;
}
function endOfWeek(date, weekStartsOn = 1) {
  const s = startOfWeek(date, weekStartsOn);
  return addDays(s, 6);
}
function fmtDate(d) { try { return new Date(d).toLocaleDateString(); } catch { return String(d); } }
function fmtTime(t) { return t ?? "-"; }

/** ---------- safe pickers so schema changes don't break UI ---------- */
function pick(obj, keys, def = "-") {
  for (const k of keys) if (obj && obj[k] != null && obj[k] !== "") return obj[k];
  return def;
}
function visitId(v, extra = "") {
  return v.id ?? v.visit_id ?? v.uuid ?? `${extra}-${Math.random().toString(36).slice(2)}`;
}

/** Group visits by key function */
function groupBy(list, keyFn) {
  const m = new Map();
  for (const it of list) {
    const k = keyFn(it);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(it);
  }
  return m;
}

/** ---------- Main component with Day/Week toggle ---------- */
export default function RotaGrid() {
  const [mode, setMode] = useState("week"); // "week" | "day"
  const [anchor, setAnchor] = useState(startOfDay(new Date())); // current focus day

  // compute query window
  const range = useMemo(() => {
    if (mode === "day") {
      const s = startOfDay(anchor);
      const e = startOfDay(addDays(anchor, 1));
      return { start: toISODate(s), end: toISODate(addDays(e, -1)) };
    }
    // week mode
    const s = startOfWeek(anchor, 1);
    const e = endOfWeek(anchor, 1);
    return { start: toISODate(s), end: toISODate(e) };
  }, [anchor, mode]);

  // try server-side filter: /visits?start=YYYY-MM-DD&end=YYYY-MM-DD
  const path = `/visits?start=${encodeURIComponent(range.start)}&end=${encodeURIComponent(range.end)}`;
  const { data, loading, error, reload } = useApi(path, { list: true, deps: [path] });
  const visitsRaw = Array.isArray(data) ? data : [];

  // If backend ignores ?start,&end, we’ll filter client-side as a fallback.
  const visits = useMemo(() => {
    const s = new Date(range.start + "T00:00:00");
    const e = new Date(range.end + "T23:59:59");
    return visitsRaw.filter(v => {
      const d = pick(v, ["date", "visit_date"], null);
      if (!d) return true; // if no date, keep it (better to show than hide)
      const dv = new Date(d);
      return dv >= s && dv <= e;
    });
  }, [visitsRaw, range.start, range.end]);

  function goPrev() {
    setAnchor(a => mode === "day" ? addDays(a, -1) : addDays(a, -7));
  }
  function goNext() {
    setAnchor(a => mode === "day" ? addDays(a, +1) : addDays(a, +7));
  }
  function goToday() {
    setAnchor(startOfDay(new Date()));
  }

  return (
    <div className="p-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="text-xl font-semibold">
          {mode === "day"
            ? fmtDate(anchor)
            : `${fmtDate(startOfWeek(anchor, 1))} – ${fmtDate(endOfWeek(anchor, 1))}`}
        </div>
        <div className="ml-4 flex gap-2">
          <button className="px-3 py-1 border rounded" onClick={goPrev}>◀ Prev</button>
          <button className="px-3 py-1 border rounded" onClick={goToday}>Today</button>
          <button className="px-3 py-1 border rounded" onClick={goNext}>Next ▶</button>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            className={`px-3 py-1 border rounded ${mode === "day" ? "bg-gray-200" : ""}`}
            onClick={() => setMode("day")}
          >
            Day
          </button>
          <button
            className={`px-3 py-1 border rounded ${mode === "week" ? "bg-gray-200" : ""}`}
            onClick={() => setMode("week")}
          >
            Week
          </button>
          <button className="px-3 py-1 border rounded" onClick={reload}>↻ Refresh</button>
        </div>
      </div>

      {/* States */}
      {loading && <div>Loading rota…</div>}
      {error && (
        <div className="text-red-600 mb-2">
          {error}
        </div>
      )}
      {!loading && !error && (mode === "day" ? (
        <DayView date={anchor} visits={visits} />
      ) : (
        <WeekView anchor={anchor} visits={visits} />
      ))}
    </div>
  );
}

/** ---------- Day View ---------- */
function DayView({ date, visits }) {
  // group by employee
  const byEmp = groupBy(visits, v =>
    pick(v, ["employee_name", "carer", "employee_full_name", "staff_name", "employee", "assignee"], "Unassigned")
  );

  if (!visits.length) return <div>No visits scheduled for {fmtDate(date)}.</div>;

  return (
    <div>
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border w-1/4">Employee</th>
            <th className="text-left p-2 border">Client</th>
            <th className="text-left p-2 border">Start</th>
            <th className="text-left p-2 border">End</th>
            <th className="text-left p-2 border">Notes</th>
          </tr>
        </thead>
        <tbody>
          {[...byEmp.entries()].map(([emp, rows]) =>
            rows.map((v, idx) => (
              <tr key={visitId(v, `day-${emp}-${idx}`)}>
                <td className="p-2 border">{idx === 0 ? emp : ""}</td>
                <td className="p-2 border">{pick(v, ["client_name", "client", "client_full_name"], "-")}</td>
                <td className="p-2 border">{fmtTime(pick(v, ["start_time", "start"]))}</td>
                <td className="p-2 border">{fmtTime(pick(v, ["end_time", "end"]))}</td>
                <td className="p-2 border">{pick(v, ["notes", "comment", "description"], "-")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/** ---------- Week View ---------- */
function WeekView({ anchor, visits }) {
  const start = startOfWeek(anchor, 1);
  const days = [...Array(7)].map((_, i) => addDays(start, i));
  const dayKeys = days.map(d => toISODate(d));

  // Map: dayKey -> visits for that day
  const byDay = new Map(dayKeys.map(k => [k, []]));
  for (const v of visits) {
    const dk = toISODate(pick(v, ["date", "visit_date"], toISODate(new Date())));
    if (!byDay.has(dk)) byDay.set(dk, []);
    byDay.get(dk).push(v);
  }

  // Build a sorted list of employees across the week
  const employeeSet = new Set();
  for (const arr of byDay.values()) {
    for (const v of arr) {
      employeeSet.add(
        pick(v, ["employee_name", "carer", "employee_full_name", "staff_name", "employee", "assignee"], "Unassigned")
      );
    }
  }
  const employees = [...employeeSet];
  if (!employees.length) return <div>No visits scheduled this week.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border w-48">Employee</th>
            {days.map(d => (
              <th key={toISODate(d)} className="text-left p-2 border">
                {d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp}>
              <td className="p-2 border align-top font-medium">{emp}</td>
              {days.map((d, colIdx) => {
                const dk = toISODate(d);
                const cellVisits = (byDay.get(dk) || []).filter(v =>
                  pick(v, ["employee_name", "carer", "employee_full_name", "staff_name", "employee", "assignee"], "Unassigned") === emp
                );
                return (
                  <td key={`${emp}-${colIdx}`} className="p-2 border align-top">
                    {cellVisits.length === 0 ? (
                      <div className="text-gray-400">—</div>
                    ) : (
                      <ul className="space-y-1">
                        {cellVisits.map((v, i) => (
                          <li key={visitId(v, `week-${emp}-${dk}-${i}`)} className="border rounded p-1">
                            <div className="text-sm">
                              <strong>{fmtTime(pick(v, ["start_time", "start"]))}</strong>
                              {" – "}
                              <strong>{fmtTime(pick(v, ["end_time", "end"]))}</strong>
                            </div>
                            <div className="text-sm">
                              {pick(v, ["client_name", "client", "client_full_name"], "-")}
                            </div>
                            {pick(v, ["notes", "comment", "description"], "") && (
                              <div className="text-xs text-gray-600">
                                {pick(v, ["notes", "comment", "description"], "")}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
