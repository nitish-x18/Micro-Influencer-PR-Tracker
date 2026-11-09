import { useMemo, useState } from "react";
import {
  Search,
  Bell,
  Plus,
  CalendarDays,
  Check,
  Clock,
  AlertTriangle,
  ChevronDown,
  X,
} from "lucide-react";

import Sidebar from "../components/sidebar";

const platforms = [
  { value: "INSTAGRAM", label: "Instagram", short: "I" },
  { value: "YOUTUBE", label: "YouTube", short: "Y" },
  { value: "PINTEREST", label: "Pinterest", short: "P" },
  { value: "BLOG", label: "Blog", short: "B" },
  { value: "OTHER", label: "Other", short: "+" },
];

function getDeadlineStatus(deadline) {
  if (deadline.status === "COMPLETED") return "COMPLETED";

  const dueDate = new Date(
    deadline.dueDate || deadline.due_date
  );

  if (Number.isNaN(dueDate.getTime())) return "UPCOMING";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today ? "OVERDUE" : "UPCOMING";
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function Deadlines({
  deadlines = [],
  shipments = [],
  onAddDeadline,
  onCompleteDeadline,
}) {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    shipmentId: "",
    platform: "",
    dueDate: "",
  });

  const deadlineRecords = useMemo(() => {
    return deadlines.map((deadline) => ({
      ...deadline,
      calculatedStatus: getDeadlineStatus(deadline),
    }));
  }, [deadlines]);

  const counts = {
    overdue: deadlineRecords.filter(
      (item) => item.calculatedStatus === "OVERDUE"
    ).length,
    upcoming: deadlineRecords.filter(
      (item) => item.calculatedStatus === "UPCOMING"
    ).length,
    completed: deadlineRecords.filter(
      (item) => item.calculatedStatus === "COMPLETED"
    ).length,
  };

  const filteredDeadlines = useMemo(() => {
    return deadlineRecords
      .filter((deadline) => {
        const content =
          deadline.content || deadline.contentName || "";

        const shipment =
          deadline.shipment?.product?.name ||
          deadline.shipment?.productName ||
          "";

        const matchesSearch = `${content} ${shipment}`
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesPlatform =
          platformFilter === "ALL" ||
          deadline.platform === platformFilter;

        const matchesStatus =
          statusFilter === "ALL" ||
          deadline.calculatedStatus === statusFilter;

        return matchesSearch && matchesPlatform && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(a.dueDate || a.due_date) -
          new Date(b.dueDate || b.due_date)
      );
  }, [
    deadlineRecords,
    search,
    platformFilter,
    statusFilter,
  ]);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  }

  function closeForm() {
    setIsFormOpen(false);
    setFormError("");

    setForm({
      shipmentId: "",
      platform: "",
      dueDate: "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.shipmentId || !form.platform || !form.dueDate) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (!onAddDeadline) {
      setFormError("Deadline integration is not connected yet.");
      return;
    }

    setSaving(true);

    try {
      await onAddDeadline(form);
      closeForm();
    } catch (error) {
      setFormError(
        error.message || "Unable to save the deadline."
      );
    } finally {
      setSaving(false);
    }
  }

  function getPlatformInfo(value) {
    return platforms.find((item) => item.value === value);
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#102536] lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7">
          <h1 className="text-xl font-extrabold">
            Content Deadlines
          </h1>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              aria-label="Search"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
            >
              <Search size={20} />
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
            >
              <Bell size={20} />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
              AM
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {/* Heading */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">
                Content Deadlines
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Final step: turn received packages into dated deliverables.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#d9683c] px-4 text-sm font-bold text-white hover:bg-[#c95a30]"
            >
              <Plus size={17} />
              Add deadline
            </button>
          </div>

          {/* Filters */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {[
              { label: "All", value: "ALL" },
              { label: `Upcoming · ${counts.upcoming}`, value: "UPCOMING" },
              { label: `Overdue · ${counts.overdue}`, value: "OVERDUE" },
              { label: "Completed", value: "COMPLETED" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatusFilter(item.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === item.value
                    ? "bg-[#0b1d2b] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Search and platform filter */}
          <div className="mb-5 flex flex-wrap gap-3">
            <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 sm:max-w-sm">
              <Search size={17} className="shrink-0 text-slate-500" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search deadlines..."
                className="w-full min-w-0 bg-transparent text-sm outline-none"
              />
            </label>

            <div className="relative">
              <select
                value={platformFilter}
                onChange={(event) =>
                  setPlatformFilter(event.target.value)
                }
                aria-label="Filter by platform"
                className="h-10 appearance-none rounded-md border border-slate-300 bg-white pl-4 pr-9 text-sm font-medium outline-none focus:border-blue-500"
              >
                <option value="ALL">All platforms</option>

                {platforms.map((platform) => (
                  <option
                    key={platform.value}
                    value={platform.value}
                  >
                    {platform.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>

          {/* Deadline list */}
          <section className="space-y-3">
            {filteredDeadlines.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 text-center">
                <CalendarDays
                  size={35}
                  className="mb-3 text-slate-400"
                />

                <h3 className="font-bold">
                  No deadlines found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Content deadlines will appear here when data is available.
                </p>
              </div>
            ) : (
              filteredDeadlines.map((deadline) => {
                const status = deadline.calculatedStatus;
                const platform = getPlatformInfo(deadline.platform);

                const content =
                  deadline.content ||
                  deadline.contentName ||
                  "Content";

                const shipment =
                  deadline.shipment?.product?.name ||
                  deadline.shipment?.productName ||
                  deadline.shipmentName ||
                  "";

                return (
                  <article
                    key={deadline.id}
                    className={`flex min-w-0 flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center ${
                      status === "OVERDUE"
                        ? "border-l-4 border-l-red-400 bg-red-50/40"
                        : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-extrabold text-[#102536]">
                      {platform?.short || "+"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-bold">
                        {content}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Due {formatDate(deadline.dueDate || deadline.due_date)}
                        {shipment && ` | ${shipment}`}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                          status === "OVERDUE"
                            ? "bg-red-100 text-red-700"
                            : status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {status === "OVERDUE" ? (
                          <AlertTriangle size={14} />
                        ) : status === "COMPLETED" ? (
                          <Check size={14} />
                        ) : (
                          <Clock size={14} />
                        )}

                        {status}
                      </span>

                      {status !== "COMPLETED" && (
                        <button
                          type="button"
                          disabled={!onCompleteDeadline}
                          onClick={() =>
                            onCompleteDeadline?.(deadline)
                          }
                          className="rounded-md border border-[#d9683c] px-3 py-1.5 text-xs font-bold text-[#d9683c] hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Mark done
                        </button>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </section>

          <p className="mt-6 text-sm font-medium text-[#c56b43]">
            Overdue items stay on the Dashboard until completed.
          </p>
        </div>

        {/* Add deadline form */}
        {isFormOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeForm();
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="deadline-form-title"
              className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2
                  id="deadline-form-title"
                  className="text-xl font-extrabold"
                >
                  Add deadline
                </h2>

                <button
                  type="button"
                  onClick={closeForm}
                  aria-label="Close form"
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-semibold">
                  Shipment *

                  <select
                    name="shipmentId"
                    value={form.shipmentId}
                    onChange={updateForm}
                    required
                    className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-3 font-normal outline-none focus:border-blue-500"
                  >
                    <option value="">Choose a shipment</option>

                    {shipments
                      .filter((shipment) => shipment.status === "RECEIVED")
                      .map((shipment) => (
                        <option
                          key={shipment.id}
                          value={shipment.id}
                        >
                          {shipment.product?.name ||
                            shipment.productName ||
                            shipment.id}{" "}
                          (RECEIVED)
                        </option>
                      ))}
                  </select>
                </label>

                <label className="block text-sm font-semibold">
                  Platform *

                  <select
                    name="platform"
                    value={form.platform}
                    onChange={updateForm}
                    required
                    className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-3 font-normal outline-none focus:border-blue-500"
                  >
                    <option value="">Choose a platform</option>

                    {platforms.map((platform) => (
                      <option
                        key={platform.value}
                        value={platform.value}
                      >
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-semibold">
                  Due date *

                  <input
                    type="datetime-local"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={updateForm}
                    required
                    className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-500"
                  />
                </label>

                {formError && (
                  <p
                    role="alert"
                    className="rounded-md bg-red-50 p-3 text-sm text-red-700"
                  >
                    {formError}
                  </p>
                )}

                <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-md bg-[#d9683c] px-4 py-3 text-sm font-bold text-white hover:bg-[#c95a30] disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 rounded-md border border-slate-300 px-4 py-3 text-sm font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}