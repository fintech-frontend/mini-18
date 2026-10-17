"use client";

import { useState } from "react";
import { fmtShort } from "@/lib/admin/format";

export type Point = { label: string; a: number; b: number; hint?: string };

/* Animatsiyalar (prefers-reduced-motion hurmat qilinadi) */
const CSS = `
@keyframes chart-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes chart-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes chart-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes donut-grow { from { stroke-dasharray: 0 var(--c); } to { stroke-dasharray: var(--len) var(--c); } }
@keyframes donut-pop { from { opacity: 0; transform: scale(.7); } to { opacity: 1; transform: scale(1); } }
@keyframes donut-spin { from { transform: rotate(-90deg); } to { transform: rotate(270deg); } }
.chart-line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: chart-draw 1.4s cubic-bezier(.4,0,.2,1) forwards; }
.chart-line-b { animation-delay: .25s; }
.chart-area { opacity: 0; animation: chart-fade 1s ease-out .7s forwards; }
.chart-label { opacity: 0; animation: chart-rise .6s ease-out forwards; }
.donut-svg { animation: donut-spin 1.1s cubic-bezier(.4,0,.2,1) both; }
.donut-seg { animation: donut-grow 1.1s cubic-bezier(.4,0,.2,1) both; transition: stroke-width .2s; }
.donut-seg:hover { stroke-width: 27; }
.donut-center { animation: donut-pop .6s ease-out .7s both; }
@media (prefers-reduced-motion: reduce) {
  .chart-line, .chart-area, .chart-label, .donut-svg, .donut-seg, .donut-center { animation: none !important; opacity: 1; }
  .chart-line { stroke-dashoffset: 0; }
  .donut-svg { transform: rotate(-90deg); }
  .donut-seg { stroke-dasharray: var(--len) var(--c); }
}
`;

/* Ikki qatorli silliq area chart (tushum va sof foyda) */
export function AreaChart({ data, height = 280 }: { data: Point[]; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 700;
  const H = height;
  const pad = { l: 8, r: 8, t: 16, b: 28 };
  const max = Math.max(1, ...data.map((d) => d.a)) * 1.1;
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(1, data.length - 1);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);

  const path = (key: "a" | "b") => {
    if (data.length < 2) return "";
    let d = `M ${x(0)} ${y(data[0][key])}`;
    for (let i = 1; i < data.length; i++) {
      const cx = (x(i - 1) + x(i)) / 2;
      d += ` C ${cx} ${y(data[i - 1][key])}, ${cx} ${y(data[i][key])}, ${x(i)} ${y(data[i][key])}`;
    }
    return d;
  };
  const area = (key: "a" | "b") =>
    data.length < 2 ? "" : `${path(key)} L ${x(data.length - 1)} ${H - pad.b} L ${x(0)} ${H - pad.b} Z`;

  const step = Math.max(1, Math.ceil(data.length / 6));
  const hv = hover !== null ? data[hover] : null;
  // ma'lumot yoki davr o'zgarganda animatsiya qayta ishlaydi
  const sig = `${data.length}-${Math.round(data.reduce((s, d) => s + d.a, 0))}`;

  return (
    <div className="relative w-full">
      <style>{CSS}</style>
      <svg
        key={sig}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((rel - pad.l) / (W - pad.l - pad.r)) * (data.length - 1));
          setHover(Math.min(data.length - 1, Math.max(0, i)));
        }}
      >
        <defs>
          <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#06214a" stopOpacity="0.12" />
            <stop offset="1" stopColor="#06214a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#186FD4" stopOpacity="0.22" />
            <stop offset="1" stopColor="#186FD4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={pad.l}
            x2={W - pad.r}
            y1={pad.t + g * (H - pad.t - pad.b)}
            y2={pad.t + g * (H - pad.t - pad.b)}
            stroke="#e6ebf4"
            strokeDasharray="4 5"
          />
        ))}
        <path className="chart-area" d={area("a")} fill="url(#gA)" />
        <path className="chart-area" d={area("b")} fill="url(#gB)" />
        <path className="chart-line" pathLength={1} d={path("a")} fill="none" stroke="#06214a" strokeWidth="2.5" strokeLinecap="round" />
        <path className="chart-line chart-line-b" pathLength={1} d={path("b")} fill="none" stroke="#186FD4" strokeWidth="2.5" strokeLinecap="round" />
        {data.map(
          (d, i) =>
            i % step === 0 && (
              <text
                key={i}
                className="chart-label"
                style={{ animationDelay: `${0.3 + (i / data.length) * 0.9}s` }}
                x={x(i)}
                y={H - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#8794aa"
              >
                {d.label}
              </text>
            )
        )}
        {hover !== null && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="#186FD4" strokeDasharray="4 4" />
            <circle cx={x(hover)} cy={y(data[hover].a)} r="5" fill="#fff" stroke="#06214a" strokeWidth="2.5" />
            <circle cx={x(hover)} cy={y(data[hover].b)} r="5" fill="#fff" stroke="#186FD4" strokeWidth="2.5" />
          </>
        )}
      </svg>
      {hv && hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 w-44 rounded-lg bg-[#1d2940] p-3 text-[11px] text-white shadow-xl"
          style={{ left: `clamp(0px, calc(${(x(hover) / W) * 100}% - 88px), calc(100% - 176px))` }}
        >
          <div className="mb-1 text-white/70">{hv.hint ?? hv.label}</div>
          <div className="text-[13px] font-bold">Tushum: {fmtShort(hv.a)} UZS</div>
          <div className="text-white/80">Sof foyda: {fmtShort(hv.b)} UZS</div>
        </div>
      )}
    </div>
  );
}

/* Donut chart */
export function Donut({
  parts,
  center,
  sub,
  size = 170,
}: {
  parts: { value: number; color: string }[];
  center: string;
  sub?: string;
  size?: number;
}) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const r = 60;
  const c = 2 * Math.PI * r;
  const offsets = parts.map((_, i) => parts.slice(0, i).reduce((s, p) => s + (p.value / total) * c, 0));
  const sig = parts.map((p) => Math.round(p.value)).join("-");

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <style>{CSS}</style>
      <svg key={sig} viewBox="0 0 160 160" className="donut-svg h-full w-full" style={{ transformOrigin: "50% 50%" }}>
        <circle cx="80" cy="80" r={r} fill="none" stroke="#eef1f7" strokeWidth="22" />
        {parts.map((p, i) => {
          const len = Math.max(0, (p.value / total) * c - 1.5);
          return (
            <circle
              key={i}
              className="donut-seg"
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke={p.color}
              strokeWidth="22"
              strokeDasharray={`${len} ${c}`}
              strokeDashoffset={-offsets[i]}
              style={{ ["--len" as string]: len, ["--c" as string]: c, animationDelay: `${i * 0.12}s` } as React.CSSProperties}
            />
          );
        })}
      </svg>
      <div key={`c-${sig}`} className="donut-center absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[22px] font-bold text-[#0f1d3a]">{center}</span>
        {sub && <span className="text-[9px] uppercase tracking-wider text-[#8794aa]">{sub}</span>}
      </div>
    </div>
  );
}
