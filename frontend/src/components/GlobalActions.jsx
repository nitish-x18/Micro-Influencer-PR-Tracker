
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  X,
  Clock,
  AlertTriangle,
  Package,
  Building2,
  CalendarDays,
  LoaderCircle,
} from "lucide-react";
import { api } from "../services/api";

function getPayload(response) {
  return response?.data?.data ?? response?.data ?? response;
}

function getArray(response, keys = []) {
  const data = getPayload(response);

  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
}

function getName(item, type) {
  if (type === "brand") {
    return item.brand_name ?? item.name ?? "Unnamed brand";
  }

  if (type === "product") {
    return item.product_name ?? item.name ?? "Unnamed product";
  }

  if (type === "shipment") {
    return item.shipment_code ?? item.product_name ?? "Shipment";
  }

  return item.content_title ?? item.title ?? "Deadline";
}

function getId(item) {
  return (
    item.id ??
    item.brand_id ??
    item.product_id ??
    item.shipment_id ??
    item.deadline_id
  );
}

const searchSources = [
  {
    type: "brand",
    label: "Brand",
    endpoint: "/brands",
    keys: ["brands"],
    path: "/brands",
    icon: Building2,
  },
  {
    type: "product",
    label: "Product",
    endpoint: "/products",
    keys: ["products"],
    path: "/products",
    icon: Package,
  },
  {
    type: "shipment",
    label: "Shipment",
    endpoint: "/shipments",
    keys: ["shipments"],
    path: "/shipments",
    icon: Package,
  },
  {
    type: "deadline",
    label: "Deadline",
    endpoint: "/deadlines",
    keys: ["deadlines", "contentDeadlines"],
    path: "/deadlines",
    icon: CalendarDays,
  },
];

function GlobalActions() {
  const navigate = useNavigate();

  const [activePanel, setActivePanel] = useState(null);
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadSearchData() {
    setLoading(true);
    setError("");

    try {
      const responses = await Promise.all(
        searchSources.map((source) => api.get(source.endpoint))
      );

      const allRecords = [];

      responses.forEach((response, index) => {
        const source = searchSources[index];
        const items = getArray(response, source.keys);

        items.forEach((item) => {
          allRecords.push({
            ...item,
            _type: source.type,
            _label: source.label,
            _path: source.path,
            _icon: source.icon,
          });
        });
      });

      setRecords(allRecords);
    } catch (err) {
      setError(err?.message || "Unable to load search data.");
    } finally {
      setLoading(false);
    }
  }

  async function loadNotifications() {
    setLoading(true);
    setError("");

    try {
      const [deadlineResponse, shipmentResponse] = await Promise.all([
        api.get("/deadlines"),
        api.get("/shipments"),
      ]);

      const deadlines = getArray(deadlineResponse, [
        "deadlines",
        "contentDeadlines",
      ]);

      const shipments = getArray(shipmentResponse, ["shipments"]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const deadlineAlerts = deadlines.map((item) => {
        const dueDate = new Date(item.due_date);
        const isCompleted =
          String(item.status ?? "").toUpperCase() === "COMPLETED" ||
          Boolean(item.completed_at);

        const isOverdue =
          !isCompleted &&
          !Number.isNaN(dueDate.getTime()) &&
          dueDate < today;

        return {
          id: `deadline-${getId(item)}`,
          title: item.content_title ?? "Content deadline",
          message: isOverdue
            ? "This deadline is overdue."
            : isCompleted
              ? "Deadline completed."
              : `Due date: ${item.due_date ?? "Not specified"}`,
          type: isOverdue ? "overdue" : isCompleted ? "completed" : "upcoming",
          path: "/deadlines",
          date: item.due_date,
        };
      });

      const shipmentAlerts = shipments.map((item) => ({
        id: `shipment-${getId(item)}`,
        title: item.shipment_code ?? "Shipment update",
        message: `Current status: ${item.status ?? "Unknown"}`,
        type: "shipment",
        path: "/shipments",
        date: item.shipment_date,
      }));

      setNotifications([
        ...deadlineAlerts,
        ...shipmentAlerts,
      ]);
    } catch (err) {
      setError(err?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activePanel === "search") {
      loadSearchData();
    }

    if (activePanel === "notifications") {
      loadNotifications();
    }
  }, [activePanel]);

  const filteredResults = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return [];

    return records
      .filter((item) => {
        const searchableText = [
          getName(item, item._type),
          item.brand_name,
          item.product_name,
          item.shipment_code,
          item.content_title,
          item.status,
          item.platform,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(value);
      })
      .slice(0, 15);
  }, [records, query]);

  function openResult(path) {
    setActivePanel(null);
    setQuery("");
    navigate(path);
  }

  function openPanel(panel) {
    setQuery("");
    setError("");
    setActivePanel((current) => current === panel ? null : panel);
  }

  return (
    <div className="relative flex items-center gap-3">
      <button
        type="button"
        onClick={() => openPanel("search")}
        aria-label="Search"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
      >
        <Search size={21} strokeWidth={1.8} />
      </button>

      <button
        type="button"
        onClick={() => openPanel("notifications")}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
      >
        <Bell size={21} strokeWidth={1.8} />
        {notifications.length > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#e56b3e]" />
        )}
      </button>

      {activePanel && (
        <div className="absolute right-0 top-12 z-[100] w-[min(90vw,390px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="font-bold text-slate-800">
              {activePanel === "search" ? "Global Search" : "Notifications"}
            </h3>

            <button
              type="button"
              onClick={() => setActivePanel(null)}
              aria-label="Close panel"
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          {activePanel === "search" && (
            <>
              <div className="border-b border-slate-100 p-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3">
                  <Search size={17} className="text-slate-400" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search brands, products, shipments..."
                    className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                    >
                      <X size={15} className="text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[350px] overflow-y-auto p-2">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                    <LoaderCircle size={17} className="animate-spin" />
                    Loading records...
                  </div>
                ) : error ? (
                  <p className="px-3 py-6 text-center text-sm text-red-600">
                    {error}
                  </p>
                ) : !query.trim() ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Type something to search across your records.
                  </p>
                ) : filteredResults.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No matching results found.
                  </p>
                ) : (
                  filteredResults.map((item, index) => {
                    const Icon = item._icon;

                    return (
                      <button
                        key={`${item._type}-${getId(item) ?? index}`}
                        type="button"
                        onClick={() => openResult(item._path)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-slate-50"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <Icon size={17} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-800">
                            {getName(item, item._type)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {item._label}
                          </span>
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          {activePanel === "notifications" && (
            <div className="max-h-[400px] overflow-y-auto p-2">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                  <LoaderCircle size={17} className="animate-spin" />
                  Loading notifications...
                </div>
              ) : error ? (
                <p className="px-3 py-6 text-center text-sm text-red-600">
                  {error}
                </p>
              ) : notifications.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No notifications available.
                </p>
              ) : (
                notifications.map((item) => {
                  const isOverdue = item.type === "overdue";
                  const Icon = isOverdue ? AlertTriangle : item.type === "shipment" ? Package : Clock;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openResult(item.path)}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left hover:bg-slate-50"
                    >
                      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isOverdue
                          ? "bg-red-50 text-red-600"
                          : "bg-orange-50 text-[#e56b3e]"
                      }`}>
                        <Icon size={17} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-800">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {item.message}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalActions;
