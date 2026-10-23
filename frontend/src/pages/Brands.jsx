
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Package,
  Truck,
  Check,
  Pencil,
  Trash2,
  X,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../components/sidebar";
import { brandService } from "../services/brandService";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const getBrandName = (brand) =>
  brand?.name ?? brand?.brandName ?? "Unnamed brand";

const getBrandWebsite = (brand) =>
  brand?.websiteUrl ?? brand?.website ?? "";


const getProducts = (brand) =>
  Array.isArray(brand?.productList) ? brand.productList : [];

const getProductCount = (brand) =>
  typeof brand?.products === "number"
    ? brand.products
    : brand?.productCount ??
      brand?.productsCount ??
      brand?.products_count ??
      getProducts(brand).length;

const getShipmentCount = (brand) =>
  Number(
    brand?.openShipments ??
      brand?.inTransit ??
      brand?.shipments ??
      0
  );

const getBrandValue = (brand) =>
  Number(
    brand?.totalValue ??
      brand?.value ??
      brand?.total_value ??
      getProducts(brand).reduce(
        (total, product) =>
          total + Number(product.price ?? product.value ?? 0),
        0
      )
  );

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    websiteUrl: "",
    description: "",
  });

  async function loadBrands() {
    setLoading(true);
    setError("");

    try {
      const result = await brandService.getAll();

      const records = Array.isArray(result)
        ? result
        : result?.data ?? result?.brands ?? [];

      setBrands(records);

      setSelectedId(null);
    } catch (err) {
      setError(err?.message || "Unable to load brands.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBrands();
  }, []);

  const filteredBrands = useMemo(() => {
    const term = search.trim().toLowerCase();

    return brands.filter((brand) => {
      const name = getBrandName(brand).toLowerCase();
      const website = getBrandWebsite(brand).toLowerCase();

      const matchesSearch =
        !term || name.includes(term) || website.includes(term);

      const matchesFilter =
        filter === "all" || getShipmentCount(brand) > 0;

      return matchesSearch && matchesFilter;
    });
  }, [brands, search, filter]);

  const selectedBrand =
  selectedId == null
    ? null
    : filteredBrands.find(
        (brand) => String(brand.id) === String(selectedId)
      ) ?? null;

  const selectedProducts = getProducts(selectedBrand);

  function openAddForm() {
    setEditingBrand(null);
    setForm({
      name: "",
      websiteUrl: "",
      description: "",
    });
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(brand) {
    setEditingBrand(brand);

    setForm({
      name: getBrandName(brand) === "Unnamed brand" ? "" : getBrandName(brand),
      websiteUrl: getBrandWebsite(brand),
      description: brand.description ?? "",
    });

    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;

    setFormOpen(false);
    setEditingBrand(null);
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const name = form.name.trim();

    if (!name) {
      setFormError("Brand name is required.");
      return;
    }

    const duplicate = brands.some(
      (brand) =>
        String(brand.id) !== String(editingBrand?.id) &&
        getBrandName(brand).trim().toLowerCase() ===
          name.toLowerCase()
    );

    if (duplicate) {
      setFormError(
        "A brand with this name already exists. Please use a different name."
      );
      return;
    }

    const payload = {
      name,
      websiteUrl: form.websiteUrl.trim(),
      description: form.description.trim(),
    };

    setSaving(true);

    try {
      if (editingBrand) {
        await brandService.update(editingBrand.id, payload);
      } else {
        await brandService.create(payload);
      }

      setFormOpen(false);
      setEditingBrand(null);

      await loadBrands();
    } catch (err) {
      setFormError(err?.message || "Unable to save the brand.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget || deleting) return;

    setDeleting(true);

    try {
      await brandService.delete(deleteTarget.id);
      setDeleteTarget(null);
      await loadBrands();
    } catch (err) {
      setError(err?.message || "Unable to delete the brand.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f4f5f9] text-[#102a3b]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        {/* Page header */}
        <header className="flex h-[72px] items-center justify-between border-b border-[#e6e9ef] bg-white px-5 sm:px-6">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight">
              Brands
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage your brands, products and shipments
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="hidden sm:inline">
              PR Package Tracker
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800">
              AM
            </span>
          </div>
        </header>

        <main className="min-w-0 bg-[#f4f5f9] p-4 sm:p-5">
          {/* Search and filters on the left; Add brand on the right */}
          


<section className="mb-4 grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
  {/* Search and filters */}
  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
    <label className="flex h-10 min-w-0 w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 sm:flex-1">
      <Search size={17} className="shrink-0 text-slate-400" />

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search brands"
        aria-label="Search brands"
        className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
      />

      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          aria-label="Clear search"
          className="shrink-0"
        >
          <X size={15} className="text-slate-400" />
        </button>
      )}
    </label>

    <div className="flex min-w-0 flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setFilter("all")}
        className={`h-10 rounded-full border px-3 text-xs font-semibold ${
          filter === "all"
            ? "border-[#0b293d] bg-[#0b293d] text-white"
            : "border-slate-200 bg-white text-slate-600"
        }`}
      >
        All brands
      </button>

      <button
        type="button"
        onClick={() => setFilter("open")}
        className={`h-10 rounded-full border px-3 text-xs ${
          filter === "open"
            ? "border-[#0b293d] bg-[#0b293d] text-white"
            : "border-slate-200 bg-white text-slate-600"
        }`}
      >
        With open shipments
      </button>
    </div>
  </div>

  {/* Add brand */}
  <div className="flex items-center justify-start xl:justify-end">
    <button
      type="button"
      onClick={openAddForm}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#f16b3b] px-5 text-sm font-semibold text-white hover:bg-[#df5a2c] sm:w-auto"
    >
      <Plus size={17} />
      Add brand
    </button>
  </div>
</section>



          {error && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>

              <button
                type="button"
                onClick={loadBrands}
                className="shrink-0 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Brand list and details: aligned to the same height */}
          <section
  className={`grid min-w-0 items-stretch gap-3 ${
    selectedBrand
      ? "grid-cols-1 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]"
      : "grid-cols-1"
  }`}
>
            {/* Brand table */}
            <div className="min-w-0">
             

              <div
  className={`min-w-0 overflow-hidden rounded-xl border border-[#e1e5ec] bg-white ${
    search.trim() || filter !== "all" ? "h-auto" : "h-[440px]"
  }`}
>
                <div className="h-full overflow-auto">
                  <table className="w-full table-fixed border-collapse text-left text-xs">
<thead className="sticky top-0 z-10 bg-[#0b293d] text-white">
                      <tr>
                        <th className="w-[43%] px-3 py-3 font-semibold">
                          Brand
                        </th>

                        <th className="w-[14%] px-1.5 py-3 text-center font-semibold">
                          Products
                        </th>

                        <th className="w-[25%] px-1 py-3 text-center font-semibold">
                          Shipments
                        </th>

                        <th className="w-[18%] px-2 py-3 text-right font-semibold">
                          Value
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-12 text-center text-slate-500"
                          >
                            <span className="inline-flex items-center gap-2">
                              <LoaderCircle
                                size={16}
                                className="animate-spin"
                              />
                              Loading brands...
                            </span>
                          </td>
                        </tr>
                      ) : filteredBrands.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-12 text-center text-slate-500"
                          >
                            {search || filter !== "all"
                              ? "No brands match your search or filter."
                              : "No brands yet. Select Add brand to create one."}
                          </td>
                        </tr>
                      ) : (
                        filteredBrands.map((brand) => {
                          const id = brand.id;
                          const name = getBrandName(brand);
                          const count = getProductCount(brand);
                          const shipments = getShipmentCount(brand);
                          const value = getBrandValue(brand);

                          const isSelected =
                            String(selectedBrand?.id) === String(id);

                          return (
                            <tr
                              key={id ?? name}
                              onClick={() => setSelectedId(id)}
                              
className="cursor-pointer border-b border-[#edf0f4] last:border-b-0 bg-white transition-colors duration-150 hover:bg-[#fff0e8]"
 

                            >
                              <td className="px-2 py-[7px] sm:px-3">
                                <div className="flex min-w-0 items-center gap-2">
                                 
<span
  className="flex h-[28px] w-[28px] shrink-0 items-center justify-center overflow-hidden rounded-[9px] text-sm font-bold text-white"
  style={{
    backgroundColor: brand.color || "#4c52f4",
  }}
>
  {brand.logoUrl || brand.logo || brand.logo_url ? (
    <img
      src={brand.logoUrl || brand.logo || brand.logo_url}
      alt={`${name} logo`}
      className="h-full w-full object-contain"
      onError={(event) => {
        event.currentTarget.style.display = "none";
        event.currentTarget.nextElementSibling.style.display = "flex";
      }}
    />
  ) : null}
  <span
    className="h-full w-full items-center justify-center"
    style={{
      display:
        brand.logoUrl || brand.logo || brand.logo_url
          ? "none"
          : "flex",
    }}
  >
    {name.charAt(0).toUpperCase()}
  </span>
</span>


                                  <span className="truncate font-semibold text-[#172c3e]">
                                    {name}
                                  </span>
                                </div>
                              </td>

                              <td className="px-1.5 py-[7px] text-center text-slate-700">
                                {count}
                              </td>

                              <td className="px-1 py-[7px] text-center">
                                {shipments > 0 ? (
                                  <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full bg-[#e9edf5] px-2 py-1 font-medium text-[#30445b]">
                                    <Truck size={13} />
                                    Shipped
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full bg-[#e5f7ee] px-2 py-1 font-medium text-[#13835a]">
                                    <Check size={13} />
                                    Received
                                  </span>
                                )}
                              </td>

                              <td className="px-2 py-[7px] text-right font-medium text-slate-700">
                                {formatCurrency(value)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-500">
                Showing {loading ? "…" : filteredBrands.length} of{" "}
                {brands.length} brands
              </p>
            </div>

            {/* Selected brand details */}
            {/* Selected brand details */}
{selectedBrand && (
  <div className="flex min-w-0 flex-col">
              

              <div className="flex min-h-[360px] max-h-[560px] min-w-0 flex-col overflow-hidden rounded-xl border border-[#e1e5ec] bg-white p-4 sm:h-[440px] sm:max-h-none sm:p-5">
                {loading ? (
                  <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
                    <LoaderCircle
                      size={17}
                      className="mr-2 animate-spin"
                    />
                    Loading brand details...
                  </div>
                ) : !selectedBrand ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                    <Package
                      size={30}
                      className="mb-3 text-slate-300"
                    />

                    <p className="font-semibold text-slate-700">
                      Select a brand to view details
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Choose a brand from the table or add a new one.
                    </p>
                  </div>
                ) : (
                  <>
          

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        
<div
  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-xl text-lg font-bold text-white"
  style={{
    backgroundColor: selectedBrand.color || "#4c52f4",
  }}
>
  {selectedBrand.logoUrl ||
  selectedBrand.logo ||
  selectedBrand.logo_url ? (
    <img
      src={
        selectedBrand.logoUrl ||
        selectedBrand.logo ||
        selectedBrand.logo_url
      }
      alt={`${getBrandName(selectedBrand)} logo`}
      className="h-full w-full object-contain"
      onError={(event) => {
        event.currentTarget.style.display = "none";
        event.currentTarget.nextElementSibling.style.display = "flex";
      }}
    />
  ) : null}
  <span
    className="h-full w-full items-center justify-center"
    style={{
      display:
        selectedBrand.logoUrl ||
        selectedBrand.logo ||
        selectedBrand.logo_url
          ? "none"
          : "flex",
    }}
  >
    {getBrandName(selectedBrand).charAt(0).toUpperCase()}
  </span>
</div>


                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-[#102a3b]">
                            {getBrandName(selectedBrand)}
                          </h3>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {getBrandWebsite(selectedBrand) ||
                              "No website provided"}
                          </p>
                        </div>
                      </div>

                      
<button
  type="button"
  onClick={() => setSelectedId(null)}
  title="Close details"
  aria-label="Close brand details"
  className="shrink-0 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
>
  <X size={18} />
</button>

                    </div>

                    {selectedBrand.description && (
                      <p className="mt-5 text-xs leading-5 text-slate-600">
                        {selectedBrand.description}
                      </p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-[#edf0f4] bg-[#f7f8fa] p-3">
                        <p className="text-[11px] text-slate-500">
                          Products
                        </p>

                        <p className="mt-1 text-xl font-bold text-[#102a3b]">
                          {getProductCount(selectedBrand)}
                        </p>
                      </div>

                      <div className="rounded-lg border-l-[3px] border-l-[#f28a35] bg-[#fff8f1] p-3">
                        <p className="text-[11px] text-slate-500">
                          In transit
                        </p>

                        <p className="mt-1 text-xl font-bold text-[#102a3b]">
                          {getShipmentCount(selectedBrand)}
                        </p>
                      </div>
                    </div>

                    
<div className="mt-5 flex min-h-0 flex-1 flex-col">

  <h4 className="mb-3 text-xs font-bold text-[#102a3b]">
    Products
  </h4>

                      {selectedProducts.length > 0 ? (
                       
<div className="min-h-0 flex-1 overflow-y-auto">

  {selectedProducts.map((product, index) => (
                            <div
                              key={
                                product.id ??
                                product.productId ??
                                index
                              }
                              className="flex items-center justify-between gap-3 border-b border-[#edf0f4] py-2.5 last:border-b-0"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#edf2ff] text-[#5870ba]">
                                  <Package size={13} />
                                </span>

                                <span className="truncate text-xs text-slate-700">
                                  {product.name ??
                                    product.productName ??
                                    "Unnamed product"}
                                </span>
                              </div>

                              <span className="shrink-0 text-xs font-medium text-slate-700">
                                {formatCurrency(
                                  product.price ?? product.value ?? 0
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="py-3 text-xs text-slate-500">
                          No product details available for this brand.
                        </p>
                      )}
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2 border-t border-[#edf0f4] pt-4">
                      <button
                        type="button"
                        onClick={() => openEditForm(selectedBrand)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#dce2e9] px-4 py-2 text-xs font-semibold text-[#102a3b] hover:bg-slate-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(selectedBrand)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#df2929] px-4 py-2 text-xs font-semibold text-white hover:bg-[#c91f1f]"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </>
                )}
                           </div>
            </div>
          )}
          </section>
        </main>
      </div>

      {/* Add/Edit form appears only after clicking Add brand or Edit */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071827]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="brand-form-title"
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="brand-form-title"
                className="text-lg font-bold text-[#102a3b]"
              >
                {editingBrand ? "Edit brand" : "Add brand"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#102a3b]">
                  Brand name <span className="text-red-500">*</span>
                </span>

                <input
                  autoFocus
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Glow & Co."
                  className="h-11 w-full rounded-lg border border-[#dce2eb] px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#102a3b]">
                  Website
                </span>

                <input
                  type="text"
                  value={form.websiteUrl}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      websiteUrl: event.target.value,
                    })
                  }
                  placeholder="example.com"
                  className="h-11 w-full rounded-lg border border-[#dce2eb] px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#102a3b]">
                  Description
                </span>

                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="Short description"
                  className="w-full resize-y rounded-lg border border-[#dce2eb] px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-[#dce2eb] px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#f16b3b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#df5a2c] disabled:opacity-60"
                >
                  {saving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingBrand
                      ? "Save changes"
                      : "Save brand"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071827]/45 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>

            <h2
              id="delete-title"
              className="text-lg font-bold text-[#102a3b]"
            >
              Delete brand?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <strong>{getBrandName(deleteTarget)}</strong>? This action
              cannot be undone.
            </p>

            
<div className="mt-4 flex shrink-0 gap-3 border-t border-[#e1e5ec] pt-4">

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-[#dce2eb] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && (
                  <LoaderCircle size={15} className="animate-spin" />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}













