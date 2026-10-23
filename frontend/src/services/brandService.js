
import { api } from "./api";

const USE_MOCK_DATA = true;
const STORAGE_KEY = "prtracker_brands";

const initialBrands = [
  {
    id: 1,
    name: "SoundNest",
    website: "soundnest.co",
    description: "Premium audio gear for everyday listeners.",
    products: 3,
    shipments: 1,
    value: 7497,
    status: "Shipped",
    color: "#4057f2",
    icon: "▥",
    productList: [
      { name: "Wireless Earbuds", value: 2499, icon: "🎧" },
      { name: "Sport Speaker", value: 3299, icon: "🔊" },
      { name: "Noise-Cancelling Headphones", value: 1699 },
    ],
  },
  {
    id: 2,
    name: "Glow & Co.",
    website: "glowandco.com",
    description: "Skincare and beauty",
    products: 2,
    shipments: 0,
    value: 3600,
    status: "Received",
    color: "#f0447a",
    icon: "✿",
    productList: [
      { name: "Daily Face Serum", value: 1800, icon: "🧴" },
      { name: "Hydrating Cream", value: 1800, icon: "🧴" },
    ],
  },
  {
    id: 3,
    name: "Trailmate",
    website: "trailmate.in",
    description: "Gear for outdoor adventures.",
    products: 4,
    shipments: 2,
    value: 6200,
    status: "Shipped",
    color: "#25a35a",
    icon: "▲",
    productList: [
      { name: "Trail Backpack", value: 3200, icon: "🎒" },
      { name: "Outdoor Bottle", value: 1200, icon: "🧴" },
      { name: "Hiking Tent", value: 1100 },
      { name: "Travel Compass", value: 700 },
    ],
  },
  {
    id: 4,
    name: "BrightHome",
    website: "brighthome.in",
    description: "Everyday essentials for modern homes.",
    products: 1,
    shipments: 0,
    value: 2100,
    status: "Received",
    color: "#f5a000",
    icon: "▣",
    productList: [{ name: "Smart Lamp", value: 2100, icon: "💡" }],
  },
  {
    id: 5,
    name: "FuelUp",
    website: "fuelup.co",
    description: "Nutrition and fitness essentials.",
    products: 2,
    shipments: 0,
    value: 1450,
    status: "Received",
    color: "#fa7037",
    icon: "ϟ",
    productList: [{ name: "Energy Bar Pack", value: 1450, icon: "⚡" }],
  },
  {
    id: 6,
    name: "Lumi Beauty",
    website: "lumibeauty.com",
    description: "Beauty essentials for every day.",
    products: 3,
    shipments: 1,
    value: 5300,
    status: "Shipped",
    color: "#a63bc5",
    icon: "✚",
    productList: [{ name: "Glow Serum", value: 2499, icon: "🧴" }],
  },
  {
    id: 7,
    name: "Pixel Gear",
    website: "pixelgear.in",
    description: "Accessories for creators and gamers.",
    products: 1,
    shipments: 0,
    value: 3999,
    status: "Received",
    color: "#0891b2",
    icon: "▣",
    productList: [{ name: "Creator Headphones", value: 3999, icon: "🎧" }],
  },
  {
    id: 8,
    name: "Aero Footwear",
    website: "aerofootwear.com",
    description: "Comfortable footwear for active lifestyles.",
    products: 2,
    shipments: 1,
    value: 4800,
    status: "Shipped",
    color: "#dc2626",
    icon: "◩",
    productList: [{ name: "Running Shoes", value: 2800, icon: "👟" }],
  },
  {
    id: 9,
    name: "Zen Tea Co.",
    website: "zentea.co",
    description: "Thoughtfully sourced teas.",
    products: 1,
    shipments: 0,
    value: 899,
    status: "Received",
    color: "#16865a",
    icon: "◉",
    productList: [{ name: "Green Tea", value: 899, icon: "🍵" }],
  },
];

function cloneBrands(brands) {
  return brands.map((brand) => ({
    ...brand,
    productList: (brand.productList || []).map((product) => ({
      ...product,
    })),
  }));
}

function loadMockBrands() {
  try {
    const savedBrands = localStorage.getItem(STORAGE_KEY);

    if (savedBrands !== null) {
      const parsedBrands = JSON.parse(savedBrands);

      if (Array.isArray(parsedBrands)) {
        return cloneBrands(parsedBrands);
      }
    }
  } catch (error) {
    console.error("Could not load saved brands:", error);
  }

  return cloneBrands(initialBrands);
}

let mockBrands = loadMockBrands();

function saveMockBrands() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(mockBrands)
    );
  } catch (error) {
    throw new Error(
      "Could not save brands in this browser. Please check your browser storage settings."
    );
  }
}

function createMockId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function validateBrand(data, existingBrands, editingId = null) {
  const name = data.name?.trim();

  if (!name) {
    throw new Error("Brand name is required.");
  }

  const duplicate = existingBrands.some(
    (brand) =>
      brand.name.trim().toLowerCase() === name.toLowerCase() &&
      String(brand.id) !== String(editingId)
  );

  if (duplicate) {
    throw new Error("A brand with this name already exists.");
  }
}

export const brandService = {
  async getAll() {
    if (USE_MOCK_DATA) {
      return cloneBrands(mockBrands);
    }

    return api.get("/brands");
  },

  async create(data) {
    if (USE_MOCK_DATA) {
      validateBrand(data, mockBrands);

      const brand = {
        id: createMockId(),
        name: data.name.trim(),
        website: (data.websiteUrl ?? data.website ?? "").trim(),
        description: data.description?.trim() || "",
        products: 0,
        shipments: 0,
        value: 0,
        status: "Received",
        color: "#64748b",
        icon: data.name.trim().charAt(0).toUpperCase(),
        productList: [],
      };

      mockBrands = [...mockBrands, brand];
      saveMockBrands();

      return cloneBrands([brand])[0];
    }

    return api.post("/brands", data);
  },

  async update(id, data) {
    if (USE_MOCK_DATA) {
      validateBrand(data, mockBrands, id);

      const existing = mockBrands.find(
        (brand) => String(brand.id) === String(id)
      );

      if (!existing) {
        throw new Error("Brand not found.");
      }

      const updated = {
        ...existing,
        name: data.name.trim(),
        website: (data.websiteUrl ?? data.website ?? "").trim(),
        description: data.description?.trim() || "",
      };

      mockBrands = mockBrands.map((brand) =>
        String(brand.id) === String(id) ? updated : brand
      );

      saveMockBrands();

      return cloneBrands([updated])[0];
    }

    return api.put(`/brands/${id}`, data);
  },

  async delete(id) {
    if (USE_MOCK_DATA) {
      const exists = mockBrands.some(
        (brand) => String(brand.id) === String(id)
      );

      if (!exists) {
        throw new Error("Brand not found.");
      }

      mockBrands = mockBrands.filter(
        (brand) => String(brand.id) !== String(id)
      );

      saveMockBrands();

      return { success: true };
    }

    return api.delete(`/brands/${id}`);
  },
};

