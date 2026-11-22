import { useMemo, useState } from "react";
import {
  Search,
  Bell,
  Truck,
  Check,
  Clock,
  Package,
  Plus,
  X,
} from "lucide-react";

import Sidebar from "../components/sidebar";

export default function Shipments({
  shipments = [],
  onMarkReceived,
  onNewShipment,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const productName =
        shipment.product?.name || shipment.productName || "";

      const brandName =
        shipment.brand?.name || shipment.brandName || "";

      const matchesSearch = `${productName} ${brandName}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL" || shipment.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [shipments, search, filter]);

  const shippedCount = shipments.filter(
    (item) => item.status === "SHIPPED"
  ).length;

  const receivedCount = shipments.filter(
    (item) => item.status === "RECEIVED"
  ).length;

  function handleConfirm() {
    if (!selectedShipment || !onMarkReceived) return;

    onMarkReceived(selectedShipment);
    setShowConfirmation(false);
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#102536] lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7">
          <h1 className="text-xl font-extrabold">Shipments</h1>

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
          {/* Page heading and action */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">
                Shipments
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track each product from SHIPPED to RECEIVED.
              </p>
            </div>

            <button
              type="button"
              onClick={onNewShipment}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#d9683c] px-4 text-sm font-bold text-white transition hover:bg-[#c95a30]"
            >
              <Plus size={17} />
              New shipment
            </button>
          </div>

          {/* Filters */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {[
              { label: "All", value: "ALL" },
              { label: `Shipped · ${shippedCount}`, value: "SHIPPED" },
              { label: `Received · ${receivedCount}`, value: "RECEIVED" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  filter === item.value
                    ? "bg-[#0b1d2b] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <label className="mb-5 flex h-10 w-full max-w-sm items-center gap-2 rounded-md border border-slate-300 bg-white px-3 focus-within:border-blue-500">
            <Search size={17} className="shrink-0 text-slate-500" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search shipments..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          {/* Main content */}
          <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
            {/* Shipment list */}
            <section className="min-w-0 space-y-3">
              {filteredShipments.length === 0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 text-center">
                  <Package size={34} className="mb-3 text-slate-400" />

                  <h3 className="font-bold text-[#102536]">
                    No shipments found
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Shipments will appear here when shipment data is available.
                  </p>
                </div>
              ) : (
                filteredShipments.map((shipment) => {
                  const productName =
                    shipment.product?.name ||
                    shipment.productName ||
                    "Product";

                  const brandName =
                    shipment.brand?.name ||
                    shipment.brandName ||
                    "";

                  const value =
                    shipment.product?.value ??
                    shipment.productValue;

                  const currency =
                    shipment.product?.currency ||
                    shipment.currency ||
                    "";

                  const isReceived = shipment.status === "RECEIVED";

                  return (
                    <article
                      key={shipment.id}
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setShowConfirmation(false);
                      }}
                      className={`flex min-w-0 flex-col gap-3 rounded-lg border-l-[5px] bg-white p-4 shadow-sm transition sm:flex-row sm:items-center sm:justify-between ${
                        isReceived
                          ? "border-l-[#198754]"
                          : "border-l-[#e58a32]"
                      } ${
                        selectedShipment?.id === shipment.id
                          ? "ring-2 ring-[#d9683c]/30"
                          : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <h3 className="break-words font-bold text-[#102536]">
                          {productName}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {brandName}
                          {value != null && (
                            <>
                              {brandName ? " | " : ""}
                              {currency}{" "}
                              {Number(value).toLocaleString("en-IN")}
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                            isReceived
                              ? "bg-[#e0f3e7] text-[#16854c]"
                              : "bg-[#fff0df] text-[#c56b1c]"
                          }`}
                        >
                          {isReceived ? (
                            <Check size={14} />
                          ) : (
                            <Truck size={14} />
                          )}

                          {shipment.status}
                        </span>

                        {!isReceived ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedShipment(shipment);
                              setShowConfirmation(true);
                            }}
                            className="rounded-md border border-[#d9683c] px-3 py-1.5 text-xs font-bold text-[#d9683c] transition hover:bg-orange-50"
                          >
                            Mark received
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedShipment(shipment);
                              setShowConfirmation(false);
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-[#d9683c] hover:underline"
                          >
                            Details
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </section>

            {/* Right detail / confirmation panel */}
            <aside className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              {selectedShipment ? (
                <>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-extrabold">
                      {showConfirmation
                        ? "Confirm change"
                        : "Shipment details"}
                    </h3>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedShipment(null);
                        setShowConfirmation(false);
                      }}
                      aria-label="Close details"
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {showConfirmation ? (
                    <>
                      <p className="text-sm text-slate-600">
                        Mark{" "}
                        <span className="font-bold text-[#102536]">
                          {selectedShipment.product?.name ||
                            selectedShipment.productName}
                        </span>{" "}
                        as <strong>RECEIVED</strong>?
                      </p>

                      <div className="my-5 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                        <Check size={17} className="mr-2 inline" />
                        Confirm shipment status change.
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={handleConfirm}
                          disabled={!onMarkReceived}
                          className="flex-1 rounded-md bg-[#d9683c] px-4 py-3 text-sm font-bold text-white hover:bg-[#c95a30] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Confirm
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowConfirmation(false)}
                          className="flex-1 rounded-md border border-slate-300 px-4 py-3 text-sm font-bold text-[#102536] hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 text-sm">
                      <DetailItem
                        label="Shipment code"
                        value={selectedShipment.code || selectedShipment.shipmentCode}
                      />

                      <DetailItem
                        label="Product"
                        value={
                          selectedShipment.product?.name ||
                          selectedShipment.productName
                        }
                      />

                      <DetailItem
                        label="Brand"
                        value={
                          selectedShipment.brand?.name ||
                          selectedShipment.brandName
                        }
                      />

                      <DetailItem
                        label="Tracking information"
                        value={
                          selectedShipment.trackingNumber ||
                          selectedShipment.trackingInfo
                        }
                      />

                      <DetailItem
                        label="Shipped date"
                        value={selectedShipment.shippedAt || selectedShipment.shippedDate}
                      />

                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-slate-400">
                          Status
                        </p>

                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold">
                          {selectedShipment.status === "RECEIVED" ? (
                            <Check size={14} />
                          ) : (
                            <Clock size={14} />
                          )}

                          {selectedShipment.status}
                        </span>
                      </div>

                      {selectedShipment.status === "SHIPPED" && (
                        <button
                          type="button"
                          onClick={() => setShowConfirmation(true)}
                          className="w-full rounded-md bg-[#d9683c] px-4 py-3 text-sm font-bold text-white hover:bg-[#c95a30]"
                        >
                          Mark as received
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
                  <Truck size={34} className="mb-3 text-slate-400" />

                  <h3 className="font-bold">
                    Shipment details
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Select a shipment to view its details and status.
                  </p>
                </div>
              )}
            </aside>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-sm font-medium text-[#c56b43]">
            Once RECEIVED, add content deadlines for that shipment.
          </p>
        </div>
      </main>
    </div>
  );
}

function DetailItem({ label, value }) {
  if (value == null || value === "") return null;

  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase text-slate-400">
        {label}
      </p>

      <p className="break-words font-semibold text-[#102536]">
        {value}
      </p>
    </div>
  );
}