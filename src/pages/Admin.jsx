/**
 * MECCA Admin Dashboard
 * Goa Explorer Event Control Panel
 *
 * READ-ONLY admin view for coupon management.
 * Connects directly to Supabase — no API routes.
 * Auto-refreshes every 10 seconds.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";

// ─────────────────────────────────────────────
// Admin Access Control
// ─────────────────────────────────────────────

const ADMIN_EMAILS = [
  "swapnil.goel25@gim.ac.in",
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Format a UTC timestamp to a readable local string */
const formatTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/** Return today's date as YYYY-MM-DD in local time */
const todayLocalDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

/** Copy text to clipboard; returns Promise<boolean> */
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/** Trigger CSV download from an array of row objects */
const exportCSV = (rows) => {
  const headers = ["Generated Time", "Email", "Name", "Coupon Code"];
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) =>
      [
        escape(formatTime(r.generated_at)),
        escape(r.email),
        escape(r.name),
        escape(r.coupon_code),
      ].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "MECCA_Coupons.csv";
  a.click();
  URL.revokeObjectURL(url);
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

/** Animated gold-bordered metric card */
const MetricCard = ({ icon, label, value, loading }) => (
  <div
    className="relative overflow-hidden rounded-2xl border border-yellow-600/40 bg-gradient-to-br from-[#0d1b2a] to-[#091421] p-6 transition-all duration-300 hover:border-yellow-500/70 hover:shadow-[0_0_24px_rgba(212,175,55,0.18)] group"
  >
    {/* Subtle corner glow */}
    <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-yellow-500/5 blur-2xl group-hover:bg-yellow-500/10 transition-all duration-500" />

    <div className="flex items-start justify-between">
      <div>
        {loading ? (
          <>
            <div className="mb-3 h-9 w-24 animate-pulse rounded-lg bg-white/10" />
            <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
          </>
        ) : (
          <>
            <p className="font-cinzel text-3xl font-bold text-yellow-400 tracking-wide">
              {value ?? "—"}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">
              {label}
            </p>
          </>
        )}
      </div>
      <span className="text-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-300">
        {icon}
      </span>
    </div>
  </div>
);

/** Small analytics info card */
const InfoCard = ({ label, value, loading }) => (
  <div className="rounded-xl border border-yellow-700/30 bg-[#0a1628]/80 px-5 py-4">
    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</p>
    {loading ? (
      <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
    ) : (
      <p className="text-sm font-semibold text-yellow-300 truncate">{value ?? "—"}</p>
    )}
  </div>
);

/** Copy button with transient "Copied!" feedback */
const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label}`}
      className={`ml-2 rounded px-2 py-0.5 text-[10px] font-medium transition-all duration-200 border ${
        copied
          ? "border-green-500/50 bg-green-900/30 text-green-400"
          : "border-yellow-700/40 bg-yellow-900/20 text-yellow-500 hover:border-yellow-500/60 hover:bg-yellow-800/30"
      }`}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
};

/** Skeleton row for table loading state */
const SkeletonRow = () => (
  <tr>
    {[...Array(4)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-3 animate-pulse rounded bg-white/10" style={{ width: `${60 + i * 10}%` }} />
      </td>
    ))}
  </tr>
);

/** Premium empty state */
const EmptyState = () => (
  <tr>
    <td colSpan={4}>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-5xl opacity-30">🎁</div>
        <p className="font-cinzel text-lg text-yellow-600/70">No coupons generated yet.</p>
        <p className="mt-1 text-xs text-slate-600 tracking-widest uppercase">
          The adventure awaits its first explorer
        </p>
      </div>
    </td>
  </tr>
);

/** Luxury error card */
const ErrorCard = ({ message, onRetry }) => (
  <div className="mx-auto mt-12 max-w-md rounded-2xl border border-red-700/40 bg-[#1a0a0a] p-8 text-center shadow-[0_0_40px_rgba(220,38,38,0.08)]">
    <div className="mb-3 text-4xl">⚠️</div>
    <p className="font-cinzel text-lg text-red-400 mb-2">Connection Error</p>
    <p className="text-sm text-slate-500 mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="rounded-xl border border-yellow-600/50 bg-yellow-900/20 px-6 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-800/30 hover:border-yellow-500"
    >
      Retry Connection
    </button>
  </div>
);

// ─────────────────────────────────────────────
// Main Admin Component
// ─────────────────────────────────────────────

export default function Admin() {
  // ── State ──────────────────────────────────
  const [coupons, setCoupons] = useState([]);
  const [totalCoupons, setTotalCoupons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const retryCountRef = useRef(0);
  const [authorized, setAuthorized] = useState(false);
const [checkingAccess, setCheckingAccess] = useState(true);
// ── Admin authentication
const checkAdminAccess = useCallback(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.toLowerCase() || "";

  if (ADMIN_EMAILS.includes(email)) {
    setAuthorized(true);
  }

  setCheckingAccess(false);
}, []);
  
  // ── Data fetching ───────────────────────────

  const fetchData = useCallback(async () => {
    try {
      // Parallel fetches: settings row + full coupon list
      const [settingsRes, couponsRes] = await Promise.all([
        supabase.from("settings").select("total_coupons").single(),
        supabase
          .from("coupons")
          .select("id, user_id, email, name, coupon_code, generated_at")
          .order("generated_at", { ascending: false }),
      ]);

      if (settingsRes.error) throw settingsRes.error;
      if (couponsRes.error) throw couponsRes.error;

      setTotalCoupons(settingsRes.data?.total_coupons ?? 0);
      setCoupons(couponsRes.data ?? []);
      setError(null);
      retryCountRef.current = 0;
    } catch (err) {
      console.error("[Admin] Supabase fetch error:", err);
      setError(err?.message || "Failed to load data from Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + auto-refresh every 10 s
useEffect(() => {
  let interval;

  const initialize = async () => {
    await checkAdminAccess();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const email = user?.email?.toLowerCase() || "";

    if (!ADMIN_EMAILS.includes(email)) return;

    fetchData();

    interval = setInterval(fetchData, 10_000);
  };

  initialize();

  return () => {
    if (interval) clearInterval(interval);
  };
}, [fetchData, checkAdminAccess]);

  // Live clock — ticks every second
  useEffect(() => {
    const tick = setInterval(() => setCurrentTime(new Date()), 1_000);
    return () => clearInterval(tick);
  }, []);

  // ── Derived metrics ─────────────────────────

  const generatedCount = coupons.length;
  const remainingCount =
    totalCoupons !== null ? Math.max(0, totalCoupons - generatedCount) : null;

  const todayStr = todayLocalDate();
  const todayCount = coupons.filter((c) => {
    if (!c.generated_at) return false;
    return c.generated_at.slice(0, 10) === todayStr;
  }).length;

  // Analytics
  const latestCoupon = coupons[0] ?? null;
  const firstCoupon = coupons[coupons.length - 1] ?? null;
  const uniqueUsers = new Set(coupons.map((c) => c.user_id || c.email)).size;

  const avgPerHour = (() => {
    if (coupons.length < 2) return "—";
    const first = new Date(firstCoupon.generated_at);
    const last = new Date(latestCoupon.generated_at);
    const diffHours = Math.max((last - first) / 3_600_000, 0.01);
    return (coupons.length / diffHours).toFixed(1);
  })();

  // ── Filtered table rows ─────────────────────

  const filteredCoupons = coupons.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.email?.toLowerCase().includes(q) || c.name?.toLowerCase().includes(q)
    );
  });

  // ── Render ─────────────────────────────────
if (checkingAccess) {
  return (
    <div className="min-h-screen bg-[#081018] flex items-center justify-center text-yellow-400 text-xl">
      Verifying admin access...
    </div>
  );
}

if (!authorized) {
  return (
    <div className="min-h-screen bg-[#081018] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-red-500">403</h1>
      <p className="mt-4 text-2xl text-white">Access Denied</p>
      <p className="mt-2 text-slate-400">
        You are not authorized to access the MECCA Admin Dashboard.
      </p>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-[#060d16] text-slate-100 font-sans">
      {/* Google Fonts injection for Cinzel */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        /* Scrollable table wrapper */
        .table-scroll::-webkit-scrollbar { height: 4px; width: 4px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 2px; }
      `}</style>

      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-30 border-b border-yellow-700/20 bg-[#060d16]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: branding */}
          <div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.12em] text-yellow-400 uppercase">
              MECCA Admin Dashboard
            </h1>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Goa Explorer Event Control Panel
            </p>
          </div>

          {/* Right: status + clock */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
                Connected
              </span>
            </div>
            <span className="text-xs tabular-nums text-slate-500">
              {currentTime.toLocaleTimeString("en-IN", { hour12: true })}
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 space-y-10">

        {/* Error state */}
        {error && !loading && (
          <ErrorCard
            message={error}
            onRetry={() => {
              setLoading(true);
              fetchData();
            }}
          />
        )}

        {/* ── METRIC CARDS ── */}
        <section>
          <p className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-yellow-700 mb-4">
            Live Metrics
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon="🎟️"
              label="Total Coupons"
              value={totalCoupons}
              loading={loading}
            />
            <MetricCard
              icon="✅"
              label="Generated Coupons"
              value={generatedCount}
              loading={loading}
            />
            <MetricCard
              icon="⏳"
              label="Remaining"
              value={remainingCount}
              loading={loading}
            />
            <MetricCard
              icon="📅"
              label="Today's Coupons"
              value={todayCount}
              loading={loading}
            />
          </div>
        </section>

        {/* ── ANALYTICS STRIP ── */}
        <section>
          <p className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-yellow-700 mb-4">
            Analytics
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <InfoCard
              label="Latest Coupon"
              value={latestCoupon ? formatTime(latestCoupon.generated_at) : "None yet"}
              loading={loading}
            />
            <InfoCard
              label="First Coupon"
              value={firstCoupon ? formatTime(firstCoupon.generated_at) : "None yet"}
              loading={loading}
            />
            <InfoCard
              label="Unique Users"
              value={uniqueUsers || "0"}
              loading={loading}
            />
            <InfoCard
              label="Avg Coupons / Hour"
              value={avgPerHour}
              loading={loading}
            />
          </div>
        </section>

        {/* ── SEARCH + EXPORT ── */}
        <section className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-600/60 text-sm pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name…"
              className="w-full rounded-xl border border-yellow-700/30 bg-[#0a1628] py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/30 transition"
            />
          </div>

          {/* CSV Export */}
          <button
            onClick={() => exportCSV(filteredCoupons)}
            disabled={filteredCoupons.length === 0}
            className="flex-shrink-0 rounded-xl border border-yellow-600/60 bg-gradient-to-br from-yellow-800/30 to-yellow-900/10 px-6 py-2.5 text-sm font-semibold text-yellow-400 tracking-wide transition hover:border-yellow-500 hover:bg-yellow-800/40 hover:shadow-[0_0_16px_rgba(212,175,55,0.2)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ⬇ Export CSV
          </button>
        </section>

        {/* ── COUPONS TABLE ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-yellow-700">
              Coupon Registry
            </p>
            <span className="text-[10px] text-slate-600 tabular-nums">
              {loading ? "…" : `${filteredCoupons.length} record${filteredCoupons.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          <div className="rounded-2xl border border-yellow-700/25 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
            {/* Scrollable wrapper */}
            <div className="table-scroll overflow-auto max-h-[520px]">
              <table className="w-full text-sm border-collapse">
                {/* Sticky header */}
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#0a1a2e] border-b border-yellow-700/30">
                    {["Generated Time", "Email", "Name", "Coupon Code"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-cinzel text-[10px] uppercase tracking-[0.2em] text-yellow-600/80 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {/* Loading skeletons */}
                  {loading &&
                    [...Array(6)].map((_, i) => <SkeletonRow key={i} />)}

                  {/* Empty state */}
                  {!loading && filteredCoupons.length === 0 && <EmptyState />}

                  {/* Data rows */}
                  {!loading &&
                    filteredCoupons.map((c, idx) => (
                      <tr
                        key={c.id}
                        className={`border-b border-white/5 transition-colors duration-150 hover:bg-yellow-500/5 ${
                          idx % 2 === 0
                            ? "bg-[#081018]"
                            : "bg-[#0a1420]"
                        }`}
                      >
                        {/* Generated Time */}
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs tabular-nums">
                          {formatTime(c.generated_at)}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-slate-300 max-w-[200px]">
                          <div className="flex items-center">
                            <span className="truncate">{c.email}</span>
                            <CopyButton text={c.email} label="email" />
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-4 py-3 text-slate-200 whitespace-nowrap">
                          {c.name || "—"}
                        </td>

                        {/* Coupon Code */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className="font-cinzel text-yellow-400 tracking-widest text-xs bg-yellow-900/20 border border-yellow-700/30 rounded px-2 py-0.5 whitespace-nowrap">
                              {c.coupon_code}
                            </span>
                            <CopyButton text={c.coupon_code} label="code" />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <footer className="text-center pb-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-700">
            Auto-refreshing every 10 seconds · Read-only view · MECCA Goa Explorer
          </p>
        </footer>
      </main>
    </div>
  );
}
