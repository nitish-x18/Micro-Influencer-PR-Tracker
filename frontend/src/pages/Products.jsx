
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Package,
  Check,
  Truck,
  CreditCard,
  AlertTriangle,
  CircleCheck,
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

const brandColors = {
  "SoundNest": "#4057f2",
  "Glow & Co.": "#f0447a",
  Trailmate: "#25a35a",
  BrightHome: "#f5a000",
  FuelUp: "#fa7037",
  "Lumi Beauty": "#a63bc5",
  "Aero Footwear": "#dc2626",
};

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

      setProducts(
        Array.isArray(productData)
          ? productData
          : productData?.data ?? productData?.products ?? []
      );

      const availableBrands = Array.isArray(brandData)
        ? brandData
        : brandData?.data ?? brandData?.brands ?? [];

      setBrands(availableBrands);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const brandNames = useMemo(
    () => brands.map((brand) => brand.name ?? brand.brandName).filter(Boolean),
    [brands]
  );

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.brand?.toLowerCase().includes(search.toLowerCase());

      const matchesBrand =
        brandFilter === "all" || product.brand === brandFilter;

      return matchesSearch && matchesBrand;
    });

    return result.sort((a, b) => {
      if (sort === "value-asc") return Number(a.value) - Number(b.value);
      if (sort === "name") return a.name.localeCompare(b.name);
      return Number(b.value) - Number(a.value);
    });
  }, [products, search, brandFilter, sort]);

  const totalValue = products.reduce(
    (sum, product) => sum + Number(product.value || 0),
    0
  );

  const receivedCount = products.filter(
    (product) => product.status === "Received"
  ).length;

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormError("");
  }
function startEdit(product) {
  setEditingProduct(product);
  setForm({
    brand: product.brand || "",
    name: product.name || "",
    value: String(product.value ?? ""),
    currency: product.currency || "INR",
  });
  setFormError("");
  setIsAddFormOpen(true);
}

function closeProductForm() {
  setIsAddFormOpen(false);
  setEditingProduct(null);
  setFormError("");
  setForm({ brand: "", name: "", value: "", currency: "INR" });
}

async function handleDelete(product) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
  );

  if (!confirmed) return;

  try {
    await productService.delete(product.id);

    setProducts((current) =>
      current.filter((item) => item.id !== product.id)
    );

    if (editingProduct?.id === product.id) {
      closeProductForm();
    }
  } catch (err) {
    setError(err.message || "Could not delete the product.");
  }
}

  
async function addProduct(event) {
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
      const updated = await productService.update(editingProduct.id, form);

      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id ? updated : product
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
            <button type="button" aria-label="Search" className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
              <Search size={20} />
            </button>
            <button type="button" aria-label="Notifications" className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
              <Bell size={20} />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
              AM
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <section className="min-w-0">
            <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
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
              <StatCard
                label="Received"
                value={receivedCount}
                icon={<Check size={17} />}
                accent="#198754"
              />
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
  <label className="flex h-10 w-full min-w-0 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 shadow-sm focus-within:border-blue-500 sm:w-[180px] sm:flex-none">
    <Search size={18} className="shrink-0 text-slate-600" />
    <input
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Search products"
      className="w-full min-w-0 bg-transparent text-sm outline-none"
    />
  </label>

              
<div className="relative h-9 min-w-0 flex-1 sm:h-8 sm:flex-none sm:w-[105px]">
  <select
    value={brandFilter}
    onChange={(event) => setBrandFilter(event.target.value)}
    aria-label="Filter by brand"
    className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full border border-slate-300 bg-white pl-4 pr-7 text-xs font-medium text-slate-700 outline-none"
  >
    <option value="all">Brand</option>
    {brandNames.map((name) => (
      <option key={name} value={name}>
        {name}
      </option>
    ))}
  </select>
  <ChevronDown
    size={14}
    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#102536]"
  />
</div>

             


<div className="relative z-30 min-w-0 flex-1 sm:flex-none">
  <button
    type="button"
    onClick={() => setIsSortOpen((open) => !open)}
    aria-label="Sort products"
    aria-expanded={isSortOpen}
    className="inline-flex h-9 w-full items-center justify-center rounded-full border border-slate-300 bg-[#0b1d2b] px-3 text-xs font-medium text-white sm:h-8 sm:w-auto"
  >
    Sort: value <span className="ml-1 text-[9px]">▼</span>
  </button>

  {isSortOpen && (
    <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg">
      <button
        type="button"
        onClick={() => {
          setSort("value-desc");
          setIsSortOpen(false);
        }}
        className={`block w-full px-3 py-2 text-left hover:bg-slate-100 ${
          sort === "value-desc" ? "font-semibold text-blue-700" : "text-slate-700"
        }`}
      >
        Value: high to low
      </button>

      <button
        type="button"
        onClick={() => {
          setSort("value-asc");
          setIsSortOpen(false);
        }}
        className={`block w-full px-3 py-2 text-left hover:bg-slate-100 ${
          sort === "value-asc" ? "font-semibold text-blue-700" : "text-slate-700"
        }`}
      >
        Value: low to high
      </button>

      <button
        type="button"
        onClick={() => {
          setSort("name");
          setIsSortOpen(false);
        }}
        className={`block w-full px-3 py-2 text-left hover:bg-slate-100 ${
          sort === "name" ? "font-semibold text-blue-700" : "text-slate-700"
        }`}
      >
        Name: A–Z
      </button>
    </div>
  )}
</div>

 

              <button
                type="button"
                onClick={() => {
  setFormError("");
  setIsAddFormOpen(true);
}}
               className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-[#d9683c] px-4 text-sm font-bold text-white transition hover:bg-[#c95a30] sm:ml-auto sm:w-auto"
              >
                <Plus size={18} />
                Add product
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="max-h-[520px] overflow-auto overscroll-x-contain rounded-lg">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead className="sticky top-0 z-20 bg-[#0b1d2b] text-white">
                    <tr>
                      <th className="sticky top-0 z-0 px-3 py-3 font-bold sm:px-4">Product</th>
                      <th className="sticky top-0 z-0 px-3 py-3 font-bold">Brand</th>
                      <th className="sticky top-0 z-0 px-3 py-3 font-bold">Value</th>
                      <th className="sticky top-0 z-0 px-3 py-3 font-bold">Currency</th>
                      <th className="sticky top-0 z-0 px-3 py-3 font-bold">Shipment</th>
                     <th className="sticky top-0 z-0 px-4 py-3 text-center font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-10 text-center text-slate-500">
                          Loading products…
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-10 text-center text-red-600">
                          {error}
                          <button onClick={loadData} className="ml-2 underline">Retry</button>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-10 text-center text-slate-500">
                          No products found. Try changing your search or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="transition hover:bg-slate-50">
                          <td className="px-3 py-2 sm:px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-blue-200 bg-blue-50 p-1 text-xl">
  <LogoImage
    src={product.imageUrl || product.image_url}
    alt={product.name}
    fallback={product.icon || "📦"}
  />
</div>
                              <span className="font-bold text-[#102536]">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-600">
                            <span className="mr-2 inline-flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-100 text-xs font-bold text-slate-600">
  <LogoImage
    src={
      brands.find(
        (brand) => (brand.name ?? brand.brandName) === product.brand
      )?.logoUrl ||
      brands.find(
        (brand) => (brand.name ?? brand.brandName) === product.brand
      )?.logo_url
    }
    alt={`${product.brand} logo`}
    fallback={product.brand?.charAt(0) || "B"}
  />
</span>
                            {product.brand}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 font-mono font-bold">
                            {money(product.value, product.currency)}
                          </td>
                          <td className="px-3 py-2.5">{product.currency}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
                                product.status === "Shipped"
                                  ? "bg-slate-200 text-[#102536]"
                                  : "bg-[#e0f3e7] text-[#16854c]"
                              }`}
                            >
                              {product.status === "Shipped" ? <Truck size={14} /> : <Check size={14} />}
                              {product.status || "Received"}
                            </span>
                          </td>
                          

<td className="px-4 py-3">
  <div className="flex items-center justify-center gap-1.5">
    <button
      type="button"
      onClick={() => startEdit(product)}
      aria-label={`Edit ${product.name}`}
      title="Edit product"
      className="flex h-8 w-8 items-center justify-center rounded-md
        text-slate-500 transition-colors
        hover:bg-blue-50 hover:text-blue-600
        focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <Pencil size={16} strokeWidth={1.8} />
    </button>

    <button
      type="button"
      onClick={() => handleDelete(product)}
      aria-label={`Delete ${product.name}`}
      title="Delete product"
      className="flex h-8 w-8 items-center justify-center rounded-md
        text-slate-500 transition-colors
        hover:bg-red-50 hover:text-red-600
        focus:outline-none focus:ring-2 focus:ring-red-200"
    >
      <Trash2 size={16} strokeWidth={1.8} />
    </button>
  </div>
</td>


                        </tr>
                      ))
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
      aria-labelledby="add-product-title"
      className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="add-product-title" className="text-xl font-extrabold">
  {editingProduct ? "Edit product" : "Add product"}
</h2>
        
<button
  type="button"
  onClick={closeProductForm}
  aria-label="Close product form"
  className="rounded-lg px-3 py-1.5 text-xl text-slate-500 hover:bg-slate-100"
>
  ×
</button>

      </div>

      {/* Move your existing Add Product form fields here:
          Brand, Product name, Value, Currency, validation and submit button. */}
          
<form onSubmit={addProduct} className="space-y-4">
  <label className="block text-sm font-semibold">
  Brand
  <select
    name="brand"
    value={form.brand}
    onChange={updateForm}
    required
    className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  >
    <option value="">Choose a brand</option>
    {brandNames.map((name) => (
      <option key={name} value={name}>
        {name}
      </option>
    ))}
  </select>
</label>

  <label className="block text-sm font-semibold">
    Product name
    <input
      id="product-name"
      name="name"
      value={form.name}
      onChange={updateForm}
      placeholder="e.g. Wireless Earbuds"
      required
      className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </label>

  <div className="grid grid-cols-[1fr_100px] gap-3">
    <label className="block text-sm font-semibold">
      Value
      <input
        name="value"
        type="number"
        min="0.01"
        step="0.01"
        value={form.value}
        onChange={updateForm}
        placeholder="2499"
        required
        className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
    <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
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

function LogoImage({ src, alt, fallback, className = "" }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!src || imageFailed) {
    return <span className={className}>{fallback}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setImageFailed(true)}
      className={`h-full w-full rounded-lg object-contain ${className}`}
    />
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

