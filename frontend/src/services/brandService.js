
import { api } from "./api";

function normalizeBrand(brand) {
  if (!brand) return null;

  return {
    ...brand,
    id: brand.brand_id ?? brand.id,
    name: brand.brand_name ?? brand.name ?? "",
    website: brand.website ?? "",
    description: brand.description ?? "",
    logo_url: brand.logo_url ?? "",
  };
}

function getResponseData(response) {
  return response?.data ?? response;
}

function createPayload(data) {
  return {
    brand_name: (data.name ?? data.brand_name ?? "").trim(),
    website: (data.websiteUrl ?? data.website ?? "").trim(),
    description: (data.description ?? "").trim(),
    ...(data.logo_url ? { logo_url: data.logo_url } : {}),
  };
}

export const brandService = {
  async getAll() {
    const response = await api.get("/brands");
    const records = getResponseData(response);

    return Array.isArray(records)
      ? records.map(normalizeBrand)
      : [];
  },

  async create(data) {
    const response = await api.post("/brands", createPayload(data));
    return normalizeBrand(getResponseData(response));
  },

  async update(id, data) {
    const response = await api.patch(
      `/brands/${id}`,
      createPayload(data)
    );

    return normalizeBrand(getResponseData(response));
  },

  async delete(id) {
    return api.delete(`/brands/${id}`);
  },
};
