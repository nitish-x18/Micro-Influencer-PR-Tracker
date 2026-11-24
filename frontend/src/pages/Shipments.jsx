
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  Truck,
  Check,
  Clock,
  Package,
  Plus,
  X,
  LoaderCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import MobileMenuButton from "../components/MobileMenuButton";
import { brandService } from "../services/brandService";
import { productService } from "../services/productService";
import { shipmentService } from "../services/shipmentService";

const getRecords = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.brands)) return result.brands;
  if (Array.isArray(result?.shipments)) return result.shipments;
  return [];
};

const getId = (item) =>
  item?.id ?? item?.product_id ?? item?.productId;

const getProductName = (item) =>
  item?.product?.name ??
  item?.productName ??
  item?.product_name ??
  item?.name ??
  "Product";

const getBrandName = (item) =>
  item?.brand?.name ??
  item?.brandName ??
  item?.brand_name ??
  "";

const getShipmentId = (item) =>
  item?.shipment_id ?? item?.id;

const getShipmentCode = (item) =>
  item?.shipment_code ?? item?.code ?? item?.shipmentCode ?? "";

const getTracking = (item) =>
  item?.tracking_reference ??
  item?.tracking_number ??
  item?.trackingNumber ??
  "";

const getShipmentDate = (item) =>
  item?.shipment_date ??
  item?.shipped_at ??
  item?.shippedAt ??
  item?.shippedDate ??
  "";

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    shipment_code: "",
    brand_id: "",
    product_id: "",
    shipment_date: new Date().toISOString().slice(0, 10),
    tracking_reference: "",
  });

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [shipmentResult, brandResult, productResult] =
        await Promise.all([
          shipmentService.getAll(),
          brandService.getAll(),
          productService.getAll(),
        ]);

      setShipments(getRecords(shipmentResult));
      setBrands(getRecords(brandResult));
      setProducts(Array.isArray(productResult) ? productResult : []);
    } catch (err) {
      setError(err?.message || "Unable to load shipment data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const availableProducts = useMemo(() => {
    return products.filter(
      (product) =>
        String(product.brandId) === String(form.brand_id)
    );
  }, [products, form.brand_id]);

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const productName = getProductName(shipment);
      const brandName = getBrandName(shipment);
      const code = getShipmentCode(shipment);

      const matchesSearch =
        `${productName} ${brandName} ${code}`
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

  function openForm() {
    setForm({
      shipment_code: "",
      brand_id: "",
      product_id: "",
      shipment_date: new Date().toISOString().slice(0, 10),
      tracking_reference: "",
    });

    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;
    setShowForm(false);
    setFormError("");
  }

  async function handleCreateShipment(event) {
    event.preventDefault();
    setFormError("");

    if (!form.shipment_code.trim()) {
      setFormError("Shipment code is required.");
      return;
    }

    if (!form.brand_id || !form.product_id) {
      setFormError("Please select a brand and product.");
      return;
    }

    if (!form.shipment_date) {
      setFormError("Please select shipment date.");
      return;
    }

    setSaving(true);

    try {
      await shipmentService.create({
        shipment_code: form.shipment_code,
        brand_id: form.brand_id,
        product_id: form.product_id,
        shipment_date: form.shipment_date,
        tracking_reference: form.tracking_reference,
      });

      setShowForm(false);
      await loadData();
    } catch (err) {
      setFormError(err?.message || "Unable to create shipment.");
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkReceived() {
    if (!selectedShipment) return;

    const shipmentId = getShipmentId(selectedShipment);

    if (!shipmentId) {
      setError("Shipment ID is missing from the server response.");
      return;
    }

    setUpdatingId(shipmentId);
    setError("");

    try {
      await shipmentService.updateStatus(shipmentId, "RECEIVED");

      setSelectedShipment(null);
      setShowConfirmation(false);

      await loadData();
    } catch (err) {
      setError(err?.message || "Unable to update shipment status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#102536] lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        {/* Page Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <MobileMenuButton />
            <h1 className="text-xl font-extrabold">Shipments</h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <span className="rounded-full p-2 text-slate-600">
              <Search size={20} />
            </span>

            <span className="rounded-full p-2 text-slate-600">
              <Bell size={20} />
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
              AM
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">Shipments</h2>
              <p className="mt-1 text-sm text-slate-500">
                Track each product from SHIPPED to RECEIVED.
              </p>
            </div>

            <button
              type="button"
              onClick={openForm}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#d9683c] px-4 text-sm font-bold text-white transition hover:bg-[#c95a30]"
            >
              <Plus size={17} />
              New shipment
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>
              <button
                type="button"
                onClick={loadData}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Status Filters */}
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

          <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
            {/* Shipment List */}
            <section className="min-w-0 space-y-3">
              {loading ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-xl border bg-white text-sm text-slate-500">
                  <LoaderCircle size={18} className="mr-2 animate-spin" />
                  Loading shipments...
                </div>
              ) : filteredShipments.length === 0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 text-center">
                  <Package size={34} className="mb-3 text-slate-400" />
                  <h3 className="font-bold text-[#102536]">
                    No shipments found
                  </h3>
                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Click New shipment to add your first shipment.
                  </p>
                </div>
              ) : (
                filteredShipments.map((shipment) => {
                  const isReceived = shipment.status === "RECEIVED";
                  const id = getShipmentId(shipment);

                  return (
                    <article
                      key={id}
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setShowConfirmation(false);
                      }}
                      className={`flex min-w-0 cursor-pointer flex-col gap-3 rounded-lg border-l-[5px] bg-white p-4 shadow-sm transition sm:flex-row sm:items-center sm:justify-between ${
                        isReceived
                          ? "border-l-[#198754]"
                          : "border-l-[#e58a32]"
                      } ${
                        String(getShipmentId(selectedShipment)) === String(id)
                          ? "ring-2 ring-[#d9683c]/30"
                          : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <h3 className="break-words font-bold text-[#102536]">
                          {getProductName(shipment)}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {getBrandName(shipment)}
                          {getShipmentCode(shipment)
                            ? ` | ${getShipmentCode(shipment)}`
                            : ""}
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

                        {!isReceived && (
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
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </section>

            {/* Shipment Details */}
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
                        Mark <strong>{getProductName(selectedShipment)}</strong>{" "}
                        as RECEIVED?
                      </p>

                      <div className="my-5 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                        <Check size={17} className="mr-2 inline" />
                        Confirm shipment status change.
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={handleMarkReceived}
                          disabled={updatingId !== null}
                          className="flex-1 rounded-md bg-[#d9683c] px-4 py-3 text-sm font-bold text-white hover:bg-[#c95a30] disabled:opacity-50"
                        >
                          {updatingId ? "Updating..." : "Confirm"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowConfirmation(false)}
                          disabled={updatingId !== null}
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
                        value={getShipmentCode(selectedShipment)}
                      />
                      <DetailItem
                        label="Product"
                        value={getProductName(selectedShipment)}
                      />
                      <DetailItem
                        label="Brand"
                        value={getBrandName(selectedShipment)}
                      />
                      <DetailItem
                        label="Tracking information"
                        value={getTracking(selectedShipment)}
                      />
                      <DetailItem
                        label="Shipped date"
                        value={getShipmentDate(selectedShipment)}
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
                  <h3 className="font-bold">Shipment details</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Select a shipment to view its details and status.
                  </p>
                </div>
              )}
            </aside>
          </div>

          <p className="mt-6 text-sm font-medium text-[#c56b43]">
            Once RECEIVED, add content deadlines for that shipment.
          </p>
        </div>
      </main>

      {/* New Shipment Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071827]/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="shipment-form-title"
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="shipment-form-title"
                className="text-xl font-extrabold text-[#102536]"
              >
                New shipment
              </h2>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
                className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-4">
              <FormField label="Shipment code">
                <input
                  required
                  value={form.shipment_code}
                  onChange={(event) =>
                    setForm({ ...form, shipment_code: event.target.value })
                  }
                  placeholder="e.g. SHIP-001"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500"
                />
              </FormField>

              <FormField label="Brand">
                <select
                  required
                  value={form.brand_id}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      brand_id: event.target.value,
                      product_id: "",
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name ?? brand.brandName}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Product">
                <select
                  required
                  value={form.product_id}
                  onChange={(event) =>
                    setForm({ ...form, product_id: event.target.value })
                  }
                  disabled={!form.brand_id}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 disabled:bg-slate-100"
                >
                  <option value="">Select product</option>
                  {availableProducts.map((product, index) => (
                    <option
                      key={getId(product) ?? index}
                      value={getId(product)}
                    >
                      {getProductName(product)}
                    </option>
                  ))}
                </select>

                {form.brand_id && availableProducts.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    No products are available in this brand's product list.
                  </p>
                )}
              </FormField>

              <FormField label="Shipment date">
                <input
                  required
                  type="date"
                  value={form.shipment_date}
                  onChange={(event) =>
                    setForm({ ...form, shipment_date: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                />
              </FormField>

              <FormField label="Tracking reference (optional)">
                <input
                  value={form.tracking_reference}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      tracking_reference: event.target.value,
                    })
                  }
                  placeholder="Enter tracking reference"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500"
                />
              </FormField>

              {formError && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#d9683c] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c95a30] disabled:opacity-50"
                >
                  {saving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  {saving ? "Saving..." : "Create shipment"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function DetailItem({ label, value }) {
  if (value == null || value === "") return null;

  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase text-slate-400">
        {label}
      </p>
      <p className="break-words font-semibold text-[#102536]">{value}</p>
    </div>
  );
}
