export const fmt = (n: number, d = 0) =>
  n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: 0 });

export const fmtShort = (n: number) => {
  const a = Math.abs(n);
  if (a >= 1e9) return `${(n / 1e9).toFixed(2)} mlrd`;
  if (a >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(Math.round(n));
};

const pad = (n: number) => String(n).padStart(2, "0");
const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

export const fmtTime = (t: number) => {
  const d = new Date(t);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const fmtDate = (t: number) => {
  const d = new Date(t);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};
export const fmtDateTime = (t: number) => `${fmtDate(t)} ${fmtTime(t)}`;
export const fmtDay = (t: number) => {
  const d = new Date(t);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]}`;
};
export const monthName = (m: number) => MONTHS[m];

export const isToday = (t: number) => new Date(t).toDateString() === new Date().toDateString();

export const dayLabel = (t: number) => (isToday(t) ? `Bugun, ${fmtTime(t)}` : fmtDateTime(t));

export function downloadCSV(name: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
