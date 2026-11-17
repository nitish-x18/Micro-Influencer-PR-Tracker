
import { api } from "./api";

const getData = (response) => {
  // Supports both Axios response and already-unwrapped response data.
  const result = response?.data ?? response;

  // Supports apiResponse format: { data, message, success }
  return result?.data ?? result;
};

export const shipmentService = {
  async getAll() {
    const response = await api.get("/shipments");
    const data = getData(response);

    return Array.isArray(data) ? data : data?.shipments ?? [];
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
    return getData(response);
  },

  async updateStatus(shipmentId, status) {
    const response = await api.patch(
      `/shipments/${shipmentId}/status`,
      { status }
    );

    return getData(response);
  },

  async getById(shipmentId) {
    const response = await api.get(`/shipments/${shipmentId}`);
    return getData(response);
  },

  async delete(shipmentId) {
    const response = await api.delete(`/shipments/${shipmentId}`);
    return getData(response);
  },
};

