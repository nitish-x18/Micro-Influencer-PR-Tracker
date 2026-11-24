
import { useEffect, useMemo, useState } from "react";

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

import Sidebar from "../components/Sidebar";

import { shipmentService } from "../services/shipmentService";
import { deadlineService } from "../services/deadlineService";

const platforms = [
  { value: "INSTAGRAM", label: "Instagram", short: "I" },
  { value: "YOUTUBE", label: "YouTube", short: "Y" },
  { value: "PINTEREST", label: "Pinterest", short: "P" },
  { value: "BLOG", label: "Blog", short: "B" },
  { value: "OTHER", label: "Other", short: "+" },
];

// Get date in local YYYY-MM-DD format
function getLocalDateString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Calculate deadline status
function getDeadlineStatus(deadline) {
  if (
    deadline.status === "COMPLETED" ||
    deadline.completed_at
  ) {
    return "COMPLETED";
  }

  const dueDate = String(
    deadline.due_date || deadline.dueDate || ""
  ).slice(0, 10);

  if (!dueDate) return "UPCOMING";

  return dueDate < getLocalDateString()
    ? "OVERDUE"
    : "UPCOMING";
}

// Format date
function formatDate(value) {
  if (!value) return "";

  const dateString = String(value).slice(0, 10);
  const parts = dateString.split("-");

  if (parts.length !== 3) return value;

  const [year, month, day] = parts;

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getShipmentId(shipment) {
  return shipment.shipment_id ?? shipment.id;
}

function getDeadlineId(deadline) {
  return deadline.deadline_id ?? deadline.id;
}

function getShipmentName(shipment) {
  return (
    shipment.product?.name ||
    shipment.productName ||
    shipment.product_name ||
    shipment.shipment_code ||
    `Shipment ${getShipmentId(shipment)}`
  );
}

export default function Deadlines() {
  const [deadlines, setDeadlines] = useState([]);
  const [shipments, setShipments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [completingId, setCompletingId] = useState(null);

  const [form, setForm] = useState({
    shipmentId: "",
    contentTitle: "",
    platform: "",
    dueDate: "",
  });

  // Fetch deadlines and shipments
  async function loadData() {
    setLoading(true);
    setLoadError("");

    try {
      const [deadlineData, shipmentData] = await Promise.all([
        deadlineService.getAll(),
        shipmentService.getAll(),
      ]);

      setDeadlines(
        Array.isArray(deadlineData) ? deadlineData : []
      );

      setShipments(
        Array.isArray(shipmentData) ? shipmentData : []
      );
    } catch (error) {
      console.error("Deadline loading error:", error);

      setLoadError(
        error.message || "Unable to load deadlines and shipments."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Only received shipments can have content deadlines
  const receivedShipments = useMemo(() => {
    return shipments.filter(
      (shipment) =>
        String(shipment.status).toUpperCase() === "RECEIVED"
    );
  }, [shipments]);

  // Calculate deadline statuses
  const deadlineRecords = useMemo(() => {
    return deadlines.map((deadline) => ({
      ...deadline,
      calculatedStatus: getDeadlineStatus(deadline),
    }));
  }, [deadlines]);

  // Deadline counts
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

  // Search and filters
  const filteredDeadlines = useMemo(() => {
    return deadlineRecords
      .filter((deadline) => {
        const content =
          deadline.content_title ||
          deadline.content ||
          deadline.contentName ||
          "";

        const shipment =
          deadline.shipment?.product?.name ||
          deadline.shipment?.productName ||
          deadline.shipment?.product_name ||
          deadline.shipment?.shipment_code ||
          deadline.shipment_name ||
          deadline.shipment_code ||
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

        return (
          matchesSearch &&
          matchesPlatform &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        const dateA = String(
          a.due_date || a.dueDate || ""
        ).slice(0, 10);

        const dateB = String(
          b.due_date || b.dueDate || ""
        ).slice(0, 10);

        return dateA.localeCompare(dateB);
      });
  }, [
    deadlineRecords,
    search,
    platformFilter,
    statusFilter,
  ]);

  // Update form fields
  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  }

  // Close and reset form
  function closeForm() {
    setIsFormOpen(false);
    setFormError("");

    setForm({
      shipmentId: "",
      contentTitle: "",
      platform: "",
      dueDate: "",
    });
  }

  // Create deadline
  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (
      !form.shipmentId ||
      !form.contentTitle.trim() ||
      !form.platform ||
      !form.dueDate
    ) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (
      !receivedShipments.some(
        (shipment) =>
          String(getShipmentId(shipment)) ===
          String(form.shipmentId)
      )
    ) {
      setFormError("Please select a valid received shipment.");
      return;
    }

    setSaving(true);

    try {
      await deadlineService.create({
        shipment_id: form.shipmentId,
        content_title: form.contentTitle,
        platform: form.platform,
        due_date: form.dueDate,
      });

      await loadData();

      closeForm();
    } catch (error) {
      console.error("Create deadline error:", error);

      setFormError(
        error.message || "Unable to save the deadline."
      );
    } finally {
      setSaving(false);
    }
  }

  // Complete deadline
  async function handleCompleteDeadline(deadline) {
    const deadlineId = getDeadlineId(deadline);

    if (!deadlineId) {
      alert("Deadline ID is missing.");
      return;
    }

    setCompletingId(deadlineId);

    try {
      await deadlineService.complete(deadlineId);
      await loadData();
    } catch (error) {
      console.error("Complete deadline error:", error);

      alert(
        error.message || "Unable to complete deadline."
      );
    } finally {
      setCompletingId(null);
    }
  }

  // Get platform details
  function getPlatformInfo(value) {
    return platforms.find(
      (item) => item.value === value
    );
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

          {/* Loading and error */}
          {loading && (
            <div className="mb-4 rounded-lg bg-white p-5 text-center text-sm text-slate-500">
              Loading deadlines and shipments...
            </div>
          )}

          {loadError && (
            <div
              role="alert"
              className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              <span>{loadError}</span>

              <button
                type="button"
                onClick={loadData}
                className="font-bold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {[
              { label: "All", value: "ALL" },
              {
                label: `Upcoming · ${counts.upcoming}`,
                value: "UPCOMING",
              },
              {
                label: `Overdue · ${counts.overdue}`,
                value: "OVERDUE",
              },
              {
                label: `Completed · ${counts.completed}`,
                value: "COMPLETED",
              },
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
              <Search
                size={17}
                className="shrink-0 text-slate-500"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
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
          {!loading && (
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

                  const platform = getPlatformInfo(
                    deadline.platform
                  );

                  const content =
                    deadline.content_title ||
                    deadline.content ||
                    deadline.contentName ||
                    "Content";

                  const shipment =
                    deadline.shipment?.product?.name ||
                    deadline.shipment?.productName ||
                    deadline.shipment?.product_name ||
                    deadline.shipment?.shipment_code ||
                    deadline.shipment_name ||
                    deadline.shipment_code ||
                    "";

                  const deadlineId = getDeadlineId(deadline);

                  return (
                    <article
                      key={deadlineId}
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
                          Due{" "}
                          {formatDate(
                            deadline.due_date ||
                            deadline.dueDate
                          )}

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
                            disabled={completingId === deadlineId}
                            onClick={() =>
                              handleCompleteDeadline(deadline)
                            }
                            className="rounded-md border border-[#d9683c] px-3 py-1.5 text-xs font-bold text-[#d9683c] hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {completingId === deadlineId
                              ? "Updating..."
                              : "Mark done"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          )}

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

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Shipment */}
                <label className="block text-sm font-semibold">
                  Shipment *

                  <select
                    name="shipmentId"
                    value={form.shipmentId}
                    onChange={updateForm}
                    required
                    className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-3 font-normal outline-none focus:border-blue-500"
                  >
                    <option value="">
                      Choose a shipment
                    </option>

                    {receivedShipments.map((shipment) => {
                      const shipmentId = getShipmentId(shipment);

                      return (
                        <option
                          key={shipmentId}
                          value={shipmentId}
                        >
                          {getShipmentName(shipment)} (RECEIVED)
                        </option>
                      );
                    })}
                  </select>

                  {receivedShipments.length === 0 && (
                    <span className="mt-2 block text-xs font-normal text-amber-700">
                      No received shipments available. Mark a shipment as RECEIVED first.
                    </span>
                  )}
                </label>

                {/* Content title */}
                <label className="block text-sm font-semibold">
                  Content Title *

                  <input
                    type="text"
                    name="contentTitle"
                    value={form.contentTitle}
                    onChange={updateForm}
                    maxLength={255}
                    required
                    placeholder="e.g. Instagram Product Review"
                    className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-500"
                  />
                </label>

                {/* Platform */}
                <label className="block text-sm font-semibold">
                  Platform *

                  <select
                    name="platform"
                    value={form.platform}
                    onChange={updateForm}
                    required
                    className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-3 font-normal outline-none focus:border-blue-500"
                  >
                    <option value="">
                      Choose a platform
                    </option>

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

                {/* Due date */}
                <label className="block text-sm font-semibold">
                  Due date *

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={updateForm}
                    required
                    className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-500"
                  />
                </label>

                {/* Form error */}
                {formError && (
                  <p
                    role="alert"
                    className="rounded-md bg-red-50 p-3 text-sm text-red-700"
                  >
                    {formError}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={
                      saving || receivedShipments.length === 0
                    }
                    className="flex-1 rounded-md bg-[#d9683c] px-4 py-3 text-sm font-bold text-white hover:bg-[#c95a30] disabled:cursor-not-allowed disabled:opacity-60"
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
