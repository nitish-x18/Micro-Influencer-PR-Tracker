
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Package,
  CreditCard,
  ChevronDown,
  Pencil,
  Trash2,
} from "lucide-react";

import Sidebar from "../components/sidebar";
import { brandService } from "../services/brandService";
import { productService } from "../services/productService";

const money = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [sort, setSort] = useState("value-desc");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    brand: "",
    name: "",
    value: "",
    currency: "INR",
  });

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [productData, brandData] = await Promise.all([
        productService.getAll(),
        brandService.getAll(),
      ]);

      setProducts(Array.isArray(productData) ? productData : []);
      setBrands(Array.isArray(brandData) ? brandData : []);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Get brand name using the actual brand ID.
  function getBrandName(product) {
    const brand = brands.find(
      (item) => String(item.id) === String(product.brandId)
    );

    return brand?.name || "Unknown brand";
  }

  function getBrandLogo(brandId) {
    const brand = brands.find(
      (item) => String(item.id) === String(brandId)
    );

    return brand?.logo_url || "";
  }

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const brandName =
        brands.find(
          (brand) => String(brand.id) === String(product.brandId)
        )?.name || "";

      const searchTerm = search.toLowerCase();

      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm) ||
        brandName.toLowerCase().includes(searchTerm);

      const matchesBrand =
        brandFilter === "all" ||
        String(product.brandId) === String(brandFilter);

      return matchesSearch && matchesBrand;
    });

    return result.sort((a, b) => {
      if (sort === "value-asc") {
        return Number(a.value) - Number(b.value);
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      return Number(b.value) - Number(a.value);
    });
  }, [products, brands, search, brandFilter, sort]);

  const totalValue = products.reduce(
    (sum, product) => sum + Number(product.value || 0),
    0
  );

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  }

  function openAddForm() {
    setEditingProduct(null);

    setForm({
      brand: "",
      name: "",
      value: "",
      currency: "INR",
    });

    setFormError("");
    setIsAddFormOpen(true);
  }

  function startEdit(product) {
    setEditingProduct(product);

    setForm({
      brand: String(product.brandId ?? ""),
      name: product.name || "",
      value: String(product.value ?? ""),
      currency: product.currency || "INR",
    });

    setFormError("");
    setIsAddFormOpen(true);
  }

  function closeProductForm() {
    if (saving) return;

    setIsAddFormOpen(false);
    setEditingProduct(null);
    setFormError("");

    setForm({
      brand: "",
      name: "",
      value: "",
      currency: "INR",
    });
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await productService.delete(product.id);

      setProducts((current) =>
        current.filter(
          (item) => String(item.id) !== String(product.id)
        )
      );
    } catch (err) {
      setError(err.message || "Could not delete the product.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.brand) {
      setFormError("Choose a brand.");
      return;
    }

    if (!form.name.trim()) {
      setFormError("Enter a product name.");
      return;
    }

    if (
      form.value === "" ||
      !Number.isFinite(Number(form.value)) ||
      Number(form.value) <= 0
    ) {
      setFormError("Enter a value greater than zero.");
      return;
    }

    setSaving(true);

    try {
      if (editingProduct) {
        const updated = await productService.update(
          editingProduct.id,
          form
        );

        setProducts((current) =>
          current.map((product) =>
            String(product.id) === String(editingProduct.id)
              ? updated
              : product
          )
        );
      } else {
        const created = await productService.create(form);

        setProducts((current) => [...current, created]);
      }

      closeProductForm();
      setBrandFilter("all");
      setSearch("");
    } catch (err) {
      setFormError(err.message || "Could not save the product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#102536] lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7">
          <h1 className="text-xl font-extrabold">Products</h1>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
              AM
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <section className="min-w-0">
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              <StatCard
                label="Products"
                value={products.length}
                icon={<Package size={17} />}
                accent="#0b1d2b"
              />

              <StatCard
                label="Total value"
                value={money(totalValue)}
                icon={<CreditCard size={17} />}
                accent="#2857d9"
              />

              <div className="col-span-2 sm:col-span-1">
                <StatCard
                  label="Brands"
                  value={brands.length}
                  icon={<Package size={17} />}
                  accent="#198754"
                />
              </div>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <label className="flex h-10 w-full min-w-0 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 shadow-sm focus-within:border-blue-500 sm:w-[180px]">
                <Search size={18} className="shrink-0 text-slate-600" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products"
                  className="w-full min-w-0 bg-transparent text-sm outline-none"
                />
              </label>

              <div className="relative h-9 min-w-0 flex-1 sm:w-[140px] sm:flex-none">
                <select
                  value={brandFilter}
                  onChange={(event) => setBrandFilter(event.target.value)}
                  aria-label="Filter by brand"
                  className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full border border-slate-300 bg-white pl-4 pr-7 text-xs font-medium text-slate-700 outline-none"
                >
                  <option value="all">All brands</option>

                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>

              <div className="relative z-30 min-w-0 flex-1 sm:flex-none">
                <button
                  type="button"
                  onClick={() => setIsSortOpen((open) => !open)}
                  aria-expanded={isSortOpen}
                  className="inline-flex h-9 w-full items-center justify-center rounded-full border border-slate-300 bg-[#0b1d2b] px-3 text-xs font-medium text-white sm:w-auto"
                >
                  Sort <span className="ml-1">▼</span>
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setSort("value-desc");
                        setIsSortOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left hover:bg-slate-100"
                    >
                      Value: high to low
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSort("value-asc");
                        setIsSortOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left hover:bg-slate-100"
                    >
                      Value: low to high
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSort("name");
                        setIsSortOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left hover:bg-slate-100"
                    >
                      Name: A–Z
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={openAddForm}
                disabled={brands.length === 0}
                className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-[#d9683c] px-4 text-sm font-bold text-white transition hover:bg-[#c95a30] disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
              >
                <Plus size={18} />
                Add product
              </button>
            </div>

            {brands.length === 0 && !loading && !error && (
              <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Add a brand before creating a product.
              </p>
            )}

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="max-h-[520px] overflow-auto overscroll-x-contain rounded-lg">
                <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                  <thead className="sticky top-0 z-20 bg-[#0b1d2b] text-white">
                    <tr>
                      <th className="px-3 py-3 font-bold sm:px-4">
                        Product
                      </th>
                      <th className="px-3 py-3 font-bold">Brand</th>
                      <th className="px-3 py-3 font-bold">Value</th>
                      <th className="px-3 py-3 font-bold">Currency</th>
                      <th className="px-4 py-3 text-center font-bold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                          Loading products…
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-10 text-center text-red-600">
                          {error}
                          <button
                            type="button"
                            onClick={loadData}
                            className="ml-2 underline"
                          >
                            Retry
                          </button>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const brandName = getBrandName(product);
                        const brandLogo = getBrandLogo(product.brandId);

                        return (
                          <tr
                            key={product.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-3 py-2 sm:px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-blue-200 bg-blue-50 p-1 text-lg">
                                  {product.imageUrl || product.image_url ? (
                                    <img
                                      src={product.imageUrl || product.image_url}
                                      alt={product.name}
                                      className="h-full w-full object-contain"
                                    />
                                  ) : (
                                    <Package size={18} />
                                  )}
                                </div>

                                <span className="font-bold text-[#102536]">
                                  {product.name}
                                </span>
                              </div>
                            </td>

                            <td className="px-3 py-2.5 text-slate-600">
                              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-slate-100 text-xs font-bold text-slate-600">
                                {brandLogo ? (
                                  <img
                                    src={brandLogo}
                                    alt={`${brandName} logo`}
                                    className="h-full w-full object-contain"
                                  />
                                ) : (
                                  brandName.charAt(0).toUpperCase()
                                )}
                              </span>

                              {brandName}
                            </td>

                            <td className="whitespace-nowrap px-3 py-2.5 font-mono font-bold">
                              {money(product.value, product.currency)}
                            </td>

                            <td className="px-3 py-2.5">
                              {product.currency}
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startEdit(product)}
                                  aria-label={`Edit ${product.name}`}
                                  title="Edit product"
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(product)}
                                  aria-label={`Delete ${product.name}`}
                                  title="Delete product"
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {!loading && !error && (
                <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              )}
            </div>
          </section>

          {isAddFormOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeProductForm();
                }
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-form-title"
                className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-6"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 id="product-form-title" className="text-xl font-extrabold">
                    {editingProduct ? "Edit product" : "Add product"}
                  </h2>

                  <button
                    type="button"
                    onClick={closeProductForm}
                    disabled={saving}
                    aria-label="Close product form"
                    className="rounded-lg px-3 py-1.5 text-xl text-slate-500 hover:bg-slate-100"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block text-sm font-semibold">
                    Brand

                    <select
                      name="brand"
                      value={form.brand}
                      onChange={updateForm}
                      required
                      disabled={Boolean(editingProduct)}
                      className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-500 disabled:bg-slate-100"
                    >
                      <option value="">Choose a brand</option>

                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>

                    {editingProduct && (
                      <span className="mt-1 block text-xs font-normal text-slate-500">
                        Brand cannot be changed while editing.
                      </span>
                    )}
                  </label>

                  <label className="block text-sm font-semibold">
                    Product name

                    <input
                      name="name"
                      value={form.name}
                      onChange={updateForm}
                      placeholder="Enter product name"
                      required
                      className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
                    />
                  </label>

                  <div className="grid grid-cols-[1fr_100px] gap-3">
                    <label className="block text-sm font-semibold">
                      Value

                      <input
                        name="value"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.value}
                        onChange={updateForm}
                        placeholder="2499"
                        required
                        className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
                      />
                    </label>

                    <label className="block text-sm font-semibold">
                      Currency

                      <select
                        name="currency"
                        value={form.currency}
                        onChange={updateForm}
                        className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-2 py-2.5 font-normal outline-none focus:border-blue-500"
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </label>
                  </div>

                  {formError && (
                    <p
                      role="alert"
                      className="rounded-md bg-red-50 p-3 text-sm text-red-700"
                    >
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#d9683c] px-4 py-3 font-bold text-white hover:bg-[#c95a30] disabled:opacity-60"
                  >
                    <Plus size={17} />

                    {saving
                      ? editingProduct
                        ? "Saving changes..."
                        : "Adding product..."
                      : editingProduct
                        ? "Save changes"
                        : "Add product"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm sm:p-4">
      <span
        className="absolute bottom-0 left-0 top-0 w-1"
        style={{ backgroundColor: accent }}
      />

      <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 sm:gap-2 sm:text-xs">
        {icon}
        {label}
      </div>

      <p className="mt-2 break-words text-lg font-extrabold tracking-tight text-[#102536] sm:text-3xl">
        {value}
      </p>
    </div>
  );
}
