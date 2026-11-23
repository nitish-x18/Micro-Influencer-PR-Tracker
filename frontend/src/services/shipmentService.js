
import { api } from "./api";

export const shipmentService = {
  async getAll() {
    const response = await api.get("/shipments");

    return Array.isArray(response?.data)
      ? response.data
      : response?.data?.shipments ?? [];
  },

  async create(shipmentData) {
    const payload = {
      shipment_code: shipmentData.shipment_code.trim(),
      brand_id: Number(shipmentData.brand_id),
      product_id: Number(shipmentData.product_id),
      shipment_date: shipmentData.shipment_date,
      status: "SHIPPED",
      tracking_reference:
        shipmentData.tracking_reference?.trim() || null,
    };

    const response = await api.post("/shipments", payload);

    return response?.data;
  },

  async updateStatus(shipmentId, status) {
    const response = await api.patch(
      `/shipments/${shipmentId}/status`,
      { status }
    );

    return response?.data;
  },

  async getById(shipmentId) {
    const response = await api.get(`/shipments/${shipmentId}`);

    return response?.data;
  },

  async delete(shipmentId) {
    const response = await api.delete(`/shipments/${shipmentId}`);

    return response?.data;
  },
};
