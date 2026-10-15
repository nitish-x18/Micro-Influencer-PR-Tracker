import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

import sidebarLogo from "../assets/mipt-sidebar-logo.png";
import Topbar from "../components/topbar";
import Sidebar from "../components/sidebar";

function AddShipment() {
  const navigate = useNavigate();

  const [brand, setBrand] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [product, setProduct] = useState("");
  const [shipmentDate, setShipmentDate] = useState("");
  const [status, setStatus] = useState("SHIPPED");
  const [trackingReference, setTrackingReference] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingShipments =
      JSON.parse(localStorage.getItem("mipt_shipments")) || [];

    const newShipment = {
      id: Date.now(),
      product,
      brand,
      brandLogo,
      status,
      shipped: shipmentDate,
      received: status === "RECEIVED" ? shipmentDate : "—",
      trackingReference,
    };

    const updatedShipments = [...existingShipments, newShipment];

    localStorage.setItem("mipt_shipments", JSON.stringify(updatedShipments));

    navigate("/shipments");
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-[#17324d]">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN AREA ================= */}
      <div className="lg:ml-[243px] min-h-screen min-w-0">
        {/* ================= TOPBAR ================= */}
        <Topbar />

        {/* ================= PAGE CONTENT ================= */}
        <main className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-[27px] pb-8 sm:pb-[40px]">
          {/* Back button */}
          <Link
            to="/shipments"
            className="inline-flex items-center gap-2 text-[11px] text-[#50657b] hover:text-[#17324d] transition mb-2"
          >
            <span className="text-[17px] leading-none">←</span>
            <span>Back to Shipments</span>
          </Link>

          {/* Heading */}
          <div className="mb-[18px]">
            <h1 className="text-[38px] leading-[42px] font-bold text-[#17324d]">
              Add Shipment
            </h1>

            <p className="mt-2 text-[14px] text-[#50657b]">
              Create a new shipment and associate it with a brand and product.
            </p>
          </div>

          {/* ================= FORM CARD ================= */}
          <form onSubmit={handleSubmit}>
            <section className="bg-white border border-[#e1e7ed] rounded-[7px] px-[14px] pt-[16px] pb-[19px]">
              <h2 className="text-[13px] font-bold text-[#17324d] mb-[16px]">
                Shipment Information
              </h2>

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-[20px] mb-[19px]">
                {/* Brand */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#40566d] mb-[7px]">
                    Brand <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={brand}
                    onChange={(e) => {
                      const selectedBrand = e.target.value;
                      setBrand(selectedBrand);

                      const logos = {
                        "Brand A": "/brand-a.png",
                        "Brand B": "/brand-b.png",
                        "Brand C": "/brand-c.png",
                        "Brand D": "/brand-d.png",
                      };

                      setBrandLogo(logos[selectedBrand] || "");
                    }}
                    required
                    className="w-full h-[31px] border border-[#d9e0e7] rounded-[5px] px-3 text-[11px] text-[#50657b] bg-white outline-none focus:border-[#9baabb]"
                  >
                    <option value="">Select a brand</option>
                    <option value="Brand A">Brand A</option>
                    <option value="Brand B">Brand B</option>
                    <option value="Brand C">Brand C</option>
                    <option value="Brand D">Brand D</option>
                  </select>
                </div>

                {/* Product */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#40566d] mb-[7px]">
                    Product <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    required
                    className="w-full h-[31px] border border-[#d9e0e7] rounded-[5px] px-3 text-[11px] text-[#50657b] bg-white outline-none focus:border-[#9baabb]"
                  >
                    <option value="">Select a product</option>
                    <option value="Wireless Earbuds">Wireless Earbuds</option>
                    <option value="Skincare Kit">Skincare Kit</option>
                    <option value="Hair Care Set">Hair Care Set</option>
                    <option value="Fitness Band">Fitness Band</option>
                    <option value="Travel Kit">Travel Kit</option>
                    <option value="Makeup Set">Makeup Set</option>
                    <option value="Sunscreen">Sunscreen</option>
                    <option value="Backpack">Backpack</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-[20px] mb-[19px]">
                {/* Shipment Date */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#40566d] mb-[7px]">
                    Shipment Date <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#50657b] pointer-events-none"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="17" rx="2" />
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <path d="M3 9h18" />
                    </svg>

                    <input
                      type="date"
                      value={shipmentDate}
                      onChange={(e) => setShipmentDate(e.target.value)}
                      required
                      className="w-full h-[31px] border border-[#d9e0e7] rounded-[5px] pl-9 pr-3 text-[11px] text-[#50657b] bg-white outline-none focus:border-[#9baabb]"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#40566d] mb-[7px]">
                    Status <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-[31px] border border-[#d9e0e7] rounded-[5px] px-3 text-[11px] text-[#50657b] bg-white outline-none focus:border-[#9baabb]"
                  >
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="RECEIVED">RECEIVED</option>
                  </select>
                </div>
              </div>

              {/* Tracking Reference */}
              <div>
                <label className="block text-[10px] font-semibold text-[#40566d] mb-[7px]">
                  Tracking Reference{" "}
                  <span className="font-normal text-[#8090a0]">(Optional)</span>
                </label>

                <input
                  type="text"
                  value={trackingReference}
                  onChange={(e) => setTrackingReference(e.target.value)}
                  placeholder="Enter tracking reference (optional)"
                  className="w-full h-[31px] border border-[#d9e0e7] rounded-[5px] px-3 text-[11px] text-[#50657b] outline-none placeholder:text-[#9aa7b4] focus:border-[#9baabb]"
                />
              </div>
            </section>

            {/* ================= BUTTONS ================= */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-[10px] mt-[17px]">
              <button
                type="button"
                onClick={() => navigate("/shipments")}
                className="h-[31px] w-full sm:w-auto min-w-[100px] px-5 rounded-[5px] border border-[#d4dce4] bg-white text-[11px] font-semibold text-[#50657b] hover:bg-[#f5f7f9] transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-[31px] w-full sm:w-auto min-w-[110px] px-5 rounded-[5px] bg-[#e96a28] hover:bg-[#d95d1e] text-white text-[11px] font-semibold transition"
              >
                Create Shipment
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AddShipment;
