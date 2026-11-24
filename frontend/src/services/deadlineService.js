
import { api } from "./api";

export const deadlineService = {
  async getAll() {
    const response = await api.get("/deadlines");

    return Array.isArray(response?.data)
      ? response.data
      : response?.data?.deadlines ?? [];
  },

  async create(deadlineData) {
    const payload = {
      shipment_id: Number(deadlineData.shipment_id),
      content_title: deadlineData.content_title.trim(),
      platform: deadlineData.platform,
      due_date: deadlineData.due_date,
    };

    const response = await api.post("/deadlines", payload);
    return response?.data;
  },

  async complete(deadlineId) {
    const response = await api.patch(
      `/deadlines/${deadlineId}/complete`,
      {}
    );

    return response?.data;
  },

  async update(deadlineId, deadlineData) {
    const response = await api.patch(
      `/deadlines/${deadlineId}`,
      deadlineData
    );

    return response?.data;
  },

  async delete(deadlineId) {
    const response = await api.delete(`/deadlines/${deadlineId}`);
    return response?.data;
  },
};
