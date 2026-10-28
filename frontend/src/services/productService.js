
import { api } from "./api";

const USE_MOCK_DATA = true;
const STORAGE_KEY = "prtracker_products";

const initialProducts = [
  { id: 1, name: "Wireless Earbuds", brand: "SoundNest", value: 2499, currency: "INR", status: "Received", icon: "🎧" },
  { id: 2, name: "Sport Speaker", brand: "SoundNest", value: 3299, currency: "INR", status: "Received", icon: "🔊" },
  { id: 3, name: "Skincare Kit", brand: "Glow & Co.", value: 1800, currency: "INR", status: "Received", icon: "🧴" },
  { id: 4, name: "Travel Mug", brand: "Trailmate", value: 950, currency: "INR", status: "Shipped", icon: "☕" },
  { id: 5, name: "Desk Lamp", brand: "BrightHome", value: 2100, currency: "INR", status: "Received", icon: "💡" },
  { id: 6, name: "Protein Snacks", brand: "FuelUp", value: 1150, currency: "INR", status: "Received", icon: "🍫" },
  { id: 7, name: "Face Serum", brand: "Lumi Beauty", value: 2650, currency: "INR", status: "Shipped", icon: "🧴" },
  { id: 8, name: "Trail Shoes", brand: "Aero Footwear", value: 4200, currency: "INR", status: "Received", icon: "👟" },
  { id: 9, name: "Creator Headphones", brand: "Pixel Gear", value: 3999, currency: "INR", status: "Received", icon: "🎧" },
  { id: 10, name: "Running Shoes", brand: "Aero Footwear", value: 2800, currency: "INR", status: "Shipped", icon: "👟" },
  { id: 11, name: "Hydrating Cream", brand: "Glow & Co.", value: 1800, currency: "INR", status: "Received", icon: "🧴" },
  { id: 12, name: "Outdoor Bottle", brand: "Trailmate", value: 1200, currency: "INR", status: "Received", icon: "🧴" },
  { id: 13, name: "Energy Bar Pack", brand: "FuelUp", value: 1450, currency: "INR", status: "Received", icon: "🍫" },
  { id: 14, name: "Glow Serum", brand: "Lumi Beauty", value: 2650, currency: "INR", status: "Shipped", icon: "🧴" },
  { id: 15, name: "Smart Lamp", brand: "BrightHome", value: 2100, currency: "INR", status: "Received", icon: "💡" },
  { id: 16, name: "Green Tea", brand: "Zen Tea Co.", value: 899, currency: "INR", status: "Received", icon: "🍵" },
];

function readProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Could not load products:", error);
  }

  return initialProducts.map((product) => ({ ...product }));
}

let products = readProducts();

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    throw new Error("Products could not be saved in this browser.");
  }
}

function validateProduct(data) {
  if (!data.brand?.trim()) throw new Error("Choose a brand.");
  if (!data.name?.trim()) throw new Error("Product name is required.");

  const value = Number(data.value);
  if (data.value === "" || !Number.isFinite(value) || value <= 0) {
    throw new Error("Enter a value greater than zero.");
  }

  if (!data.currency?.trim()) throw new Error("Choose a currency.");

  if (
    products.some(
      (product) =>
        product.name.trim().toLowerCase() === data.name.trim().toLowerCase() &&
        product.brand.trim().toLowerCase() === data.brand.trim().toLowerCase()
    )
  ) {
    throw new Error("This product already exists for the selected brand.");
  }
}

export const productService = {
  async getAll() {
    if (USE_MOCK_DATA) return products.map((product) => ({ ...product }));
    return api.get("/products");
  },

  async create(data) {
    if (USE_MOCK_DATA) {
      validateProduct(data);

      const product = {
        id: Date.now(),
        name: data.name.trim(),
        brand: data.brand.trim(),
        value: Number(data.value),
        currency: data.currency,
        status: "Received",
        icon: data.icon || "📦",
      };

      products = [...products, product];
      saveProducts();
      return { ...product };
    }

    return api.post("/products", data);
  },
  
  async update(id, data) {
    if (USE_MOCK_DATA) {
      if (!data.brand?.trim()) throw new Error("Choose a brand.");
      if (!data.name?.trim()) throw new Error("Product name is required.");

      const value = Number(data.value);
      if (data.value === "" || !Number.isFinite(value) || value <= 0) {
        throw new Error("Enter a value greater than zero.");
      }

      const duplicate = products.some(
        (product) =>
          product.id !== id &&
          product.name.trim().toLowerCase() === data.name.trim().toLowerCase() &&
          product.brand.trim().toLowerCase() === data.brand.trim().toLowerCase()
      );

      if (duplicate) {
        throw new Error("This product already exists for the selected brand.");
      }

      const index = products.findIndex((product) => product.id === id);
      if (index === -1) throw new Error("Product not found.");

      const updated = {
        ...products[index],
        name: data.name.trim(),
        brand: data.brand.trim(),
        value,
        currency: data.currency,
      };

      products = products.map((product) =>
        product.id === id ? updated : product
      );

      saveProducts();
      return { ...updated };
    }

    return api.put(`/products/${id}`, data);
  },

  async delete(id) {
    if (USE_MOCK_DATA) {
      const exists = products.some((product) => product.id === id);
      if (!exists) throw new Error("Product not found.");

      products = products.filter((product) => product.id !== id);
      saveProducts();
      return { success: true };
    }

    return api.delete(`/products/${id}`);
  },

};
