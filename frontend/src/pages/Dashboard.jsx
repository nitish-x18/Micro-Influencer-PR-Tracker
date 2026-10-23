import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock3,
  Package,
  Truck,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function getPayload(response) {
  return response?.data?.data ?? response?.data ?? response;
}

function formatNumber(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number.toLocaleString("en-IN") : "0";
}

function formatDate(value) {
  if (!value) return { day: "—", month: "—" };

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { day: "—", month: "—" };

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleString("en-IN", { month: "short" }).toUpperCase(),
  };
}

function StatCard({ icon, title, value, subtitle, accent, iconBackground }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-5">
      <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBackground}`}>
          {icon}
        </div>
        <p className="text-sm font-semibold text-slate-500">{title}</p>
      </div>
      <p className="mt-5 text-[30px] font-extrabold leading-none tracking-tight text-slate-900">
        {formatNumber(value)}
      </p>
      <p className="mt-3 text-xs font-medium text-slate-500">{subtitle}</p>
    </div>
  );
}

function DeadlineRow({ deadline, overdue = false }) {
  const date = formatDate(
    deadline.due_date ?? deadline.deadline_date ?? deadline.deadline
  );

  return (
    <div className="flex items-center gap-4 border-b border-slate-200 py-3 last:border-b-0">
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-100">
        <span className="text-lg font-extrabold leading-none text-slate-900">
          {date.day}
        </span>
        <span className="mt-1 text-[10px] font-bold tracking-wide text-slate-500">
          {date.month}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-900">
          {deadline.title ?? deadline.content_title ?? deadline.task_name ?? "Untitled deadline"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {deadline.brand_name ?? deadline.brand ?? "Brand"}
          {" · "}
          {deadline.platform ?? deadline.social_platform ?? "Content deadline"}
        </p>
      </div>

      <div className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
        overdue ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
      }`}>
        {overdue ? <AlertTriangle size={14} /> : <Clock3 size={14} />}
        <span>{overdue ? "Overdue" : "Upcoming"}</span>
      </div>
    </div>
  );
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [deadlineData, setDeadlineData] = useState({ upcoming: [], overdue: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboardResponse, deadlinesResponse] = await Promise.all([
        api.get("/dashboard"),
        api.get("/dashboard/deadlines"),
      ]);

      const data = getPayload(dashboardResponse);
      const deadlines = getPayload(deadlinesResponse);

      setDashboard(data);
      setDeadlineData({
        upcoming: Array.isArray(deadlines?.upcoming) ? deadlines.upcoming : [],
        overdue: Array.isArray(deadlines?.overdue) ? deadlines.overdue : [],
      });
    } catch (err) {
      setError(err.message || "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 p-8 text-slate-600">
        <RefreshCw className="animate-spin" size={20} />
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-5 rounded-xl border border-red-200 bg-white p-6">
        <h2 className="font-bold text-red-700">Dashboard could not load</h2>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <p className="mt-2 text-sm text-slate-500">
          Check that the backend is running and that you are logged in.
        </p>
        <button
          type="button"
          onClick={loadDashboard}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  const summary = dashboard?.summary ?? {};
  const upcoming = deadlineData.upcoming.length
    ? deadlineData.upcoming
    : dashboard?.upcomingDeadlinesList ?? [];
  const overdue = deadlineData.overdue.length
    ? deadlineData.overdue
    : dashboard?.overdueDeadlinesList ?? [];

  const shipped = summary.shippedShipments ?? 0;
  const received = summary.receivedShipments ?? 0;
  const totalShipments = summary.totalShipments ?? 0;

  return (
    <main className="min-h-full bg-[#f6f8fa] p-5 lg:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Your PR shipments and content deadlines at a glance.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Truck size={18} />}
          title="Total shipments"
          value={summary.totalShipments}
          subtitle={`${formatNumber(shipped)} shipped`}
          accent="bg-slate-900"
          iconBackground="bg-slate-50 text-slate-600"
        />
        <StatCard
          icon={<Clock3 size={18} />}
          title="Upcoming deadlines"
          value={summary.upcomingDeadlines ?? upcoming.length}
          subtitle="Pending content tasks"
          accent="bg-orange-500"
          iconBackground="bg-orange-50 text-orange-600"
        />
        <StatCard
          icon={<AlertTriangle size={18} />}
          title="Overdue deadlines"
          value={summary.overdueDeadlines ?? overdue.length}
          subtitle="Need attention"
          accent="bg-red-500"
          iconBackground="bg-red-50 text-red-600"
        />
        <StatCard
          icon={<Check size={18} />}
          title="Completed deadlines"
          value={summary.completedDeadlines}
          subtitle="Marked as completed"
          accent="bg-emerald-600"
          iconBackground="bg-emerald-50 text-emerald-600"
        />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Upcoming deadlines</h2>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700"
            >
              View all <ArrowRight size={17} />
            </Link>
          </div>
          {upcoming.length ? (
            upcoming.slice(0, 5).map((deadline, index) => (
              <DeadlineRow key={deadline.id ?? deadline.deadline_id ?? index} deadline={deadline} />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-slate-500">No upcoming deadlines.</p>
          )}

          <h2 className="mb-2 mt-6 text-lg font-extrabold text-slate-900">Overdue deadlines</h2>
          {overdue.length ? (
            overdue.slice(0, 5).map((deadline, index) => (
              <DeadlineRow key={deadline.id ?? deadline.deadline_id ?? index} deadline={deadline} overdue />
            ))
          ) : (
            <p className="py-4 text-sm text-slate-500">No overdue deadlines.</p>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-extrabold text-slate-900">Shipment status</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Truck size={16} /> Shipped
                </span>
                <span className="font-bold text-slate-900">{formatNumber(shipped)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-800"
                  style={{ width: `${totalShipments ? (shipped / totalShipments) * 100 : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <Check size={16} /> Received
                </span>
                <span className="font-bold text-slate-900">{formatNumber(received)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${totalShipments ? (received / totalShipments) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-extrabold text-slate-900">Overview</h2>
            <div className="mt-4 space-y-4">
              {[
                ["Brands tracked", summary.totalBrands],
                ["Products tracked", summary.totalProducts],
                ["Total deadlines", summary.totalDeadlines],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">{label}</span>
                  <span className="font-bold text-slate-900">{formatNumber(value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Package size={17} />
              <span>Recent shipments</span>
            </div>
            {Array.isArray(dashboard?.recentShipments) && dashboard.recentShipments.length ? (
              <div className="mt-3 divide-y divide-slate-100">
                {dashboard.recentShipments.slice(0, 5).map((shipment, index) => (
                  <div key={shipment.id ?? shipment.shipment_id ?? index} className="py-3">
                    <p className="text-sm font-bold text-slate-900">
                      {shipment.product_name ?? shipment.productName ?? shipment.name ?? "Shipment"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {shipment.brand_name ?? shipment.brand ?? "Brand"}
                      {" · "}
                      {shipment.status ?? "Status unavailable"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No shipments available yet.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;