
import { api } from "./api";

function normalizeProduct(product) {
  if (!product) return null;

  return {
    ...product,
    id: product.product_id ?? product.id,
    name: product.product_name ?? product.name ?? "",
    brandId: product.brand_id ?? product.brandId,
    brand: product.brand_name ?? product.brand ?? "",
    value: Number(product.value ?? 0),
    currency: product.currency ?? "INR",
  };
}

function getResponseData(response) {
  return response?.data ?? response;
}

export const productService = {
  async getAll() {
    const response = await api.get("/products");
    const records = getResponseData(response);

    return Array.isArray(records)
      ? records.map(normalizeProduct)
      : [];
  },

  async create(data) {
    const payload = {
      brand_id: Number(data.brand),
      product_name: data.name.trim(),
      value: Number(data.value),
      currency: data.currency.trim().toUpperCase(),
    };

    const response = await api.post("/products", payload);
    return normalizeProduct(getResponseData(response));
  },

  async update(id, data) {
    const payload = {
      product_name: data.name.trim(),
      value: Number(data.value),
      currency: data.currency.trim().toUpperCase(),
    };

    const response = await api.patch(`/products/${id}`, payload);
    return normalizeProduct(getResponseData(response));
  },

  async delete(id) {
    return api.delete(`/products/${id}`);
  },
};

