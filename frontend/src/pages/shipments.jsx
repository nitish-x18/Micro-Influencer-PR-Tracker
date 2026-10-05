import React, { useMemo, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import sidebarLogo from "../assets/mipt-sidebar-logo.png";
import Topbar from "../components/topbar";
import Sidebar from "../components/sidebar";

function Shipments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [brandFilter, setBrandFilter] = useState("All Brands");
  const [productFilter, setProductFilter] = useState("All Products");
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const shipments =
  JSON.parse(localStorage.getItem("mipt_shipments")) || [];

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        shipment.product.toLowerCase().includes(searchText) ||
        shipment.brand.toLowerCase().includes(searchText) ||
        shipment.status.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All Statuses" || shipment.status === statusFilter;

      const matchesBrand =
        brandFilter === "All Brands" || shipment.brand === brandFilter;

      const matchesProduct =
        productFilter === "All Products" || shipment.product === productFilter;

      return matchesSearch && matchesStatus && matchesBrand && matchesProduct;
    });
  }, [search, statusFilter, brandFilter, productFilter]);

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
          {/* Heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-[23px]">
            <div>
              <h1 className="text-[38px] leading-[42px] font-bold text-[#17324d]">
                Shipments
              </h1>

              <p className="mt-2 text-[15px] text-[#50657b]">
                Track your PR package shipments and monitor their status.
              </p>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-[#50657b] text-[12px] mt-9">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M3 9h18" />
              </svg>

              <span>{formattedDate} </span>
            </div>
          </div>

          {/* ================= FILTER BAR ================= */}
          <section className="bg-white border border-[#e1e7ed] rounded-[7px] px-5 py-5 mb-[19px]">
            <div className="flex flex-col xl:flex-row xl:items-center gap-3 xl:gap-[14px]">
              {/* Search shipments */}
              <div className="relative w-full xl:flex-1">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#17324d]"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shipments..."
                  className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] pl-11 pr-4 text-[13px] text-[#17324d] outline-none focus:border-[#9baabb]"
                />
              </div>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full xl:w-[205px] h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[13px] text-[#34495e] bg-white outline-none"
              >
                <option>All Statuses</option>
                <option>SHIPPED</option>
                <option>RECEIVED</option>
              </select>

              {/* Brand */}
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full xl:w-[205px] h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[13px] text-[#34495e] bg-white outline-none"
              >
                <option>All Brands</option>
                <option>Brand A</option>
                <option>Brand B</option>
                <option>Brand C</option>
                <option>Brand D</option>
              </select>

              {/* Product */}
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full xl:w-[205px] h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[13px] text-[#34495e] bg-white outline-none"
              >
                <option>All Products</option>
                <option>Wireless Earbuds</option>
                <option>Skincare Kit</option>
                <option>Hair Care Set</option>
                <option>Fitness Band</option>
                <option>Travel Kit</option>
                <option>Makeup Set</option>
                <option>Sunscreen</option>
                <option>Backpack</option>
              </select>

              {/* Create Shipment */}
              <Link
                to="/shipments/add"
                className="h-[40px] w-full xl:min-w-[158px] xl:w-auto px-5 rounded-[6px] bg-[#e96a28] hover:bg-[#d95d1e] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition"
              >
                <span className="text-[21px] font-light leading-none">+</span>

                <span>Create Shipment</span>
              </Link>
            </div>
          </section>

          {/* ================= SHIPMENT TABLE ================= */}
          <section className="bg-white border border-[#e1e7ed] rounded-[7px] overflow-hidden">
            <div className="px-[18px] pt-[19px]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f7f9fb]">
                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Product
                      </th>

                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Brand
                      </th>

                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Status
                      </th>

                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Shipped
                      </th>

                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Received
                      </th>

                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredShipments.map((shipment) => (
                      <tr
                        key={shipment.id}
                        className="border-b border-[#e7ebef] last:border-b-0"
                      >
                        <td className="px-[11px] py-[14px] text-[12px] text-[#40566d]">
                          {shipment.product}
                        </td>

                        <td className="px-[11px] py-[14px] text-[12px] text-[#40566d]">
                          {shipment.brand}
                        </td>

                        <td className="px-[11px] py-[14px]">
                          {shipment.status === "SHIPPED" ? (
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff2df] px-3 py-[5px] text-[10px] font-semibold text-[#e87517]">
                              <span className="w-[8px] h-[8px] rounded-full bg-[#ef7d17]"></span>
                              SHIPPED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#e0f5ed] px-3 py-[5px] text-[10px] font-semibold text-[#158064]">
                              <span className="w-[8px] h-[8px] rounded-full bg-[#15906f]"></span>
                              RECEIVED
                            </span>
                          )}
                        </td>

                        <td className="px-[11px] py-[14px] text-[12px] text-[#40566d]">
                          {shipment.shipped}
                        </td>

                        <td className="px-[11px] py-[14px] text-[12px] text-[#40566d]">
                          {shipment.received}
                        </td>

                        <td className="px-[11px] py-[14px]">
                          <Link
                            to={`/shipments/${shipment.id}`}
                            className="h-[31px] min-w-[86px] px-4 rounded-[6px] border border-[#d7dfe7] bg-white text-[11px] text-[#40566d] hover:bg-[#f5f7f9] transition inline-flex items-center justify-center"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {filteredShipments.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-12 text-[13px] text-[#64748b]"
                        >
                          No shipments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ================= TABLE FOOTER ================= */}
              <div className="h-[77px] flex items-center justify-between">
                <p className="text-[11px] text-[#64748b]">
                  Showing 1-{filteredShipments.length} of{" "}
                  {filteredShipments.length} shipments
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-[31px] h-[31px] rounded-[6px] border border-[#dce2e8] bg-white text-[#9aa7b4] flex items-center justify-center"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="w-[31px] h-[31px] rounded-[6px] bg-[#e96a28] text-white text-[12px] font-semibold flex items-center justify-center"
                  >
                    1
                  </button>

                  <button
                    type="button"
                    className="w-[31px] h-[31px] rounded-[6px] border border-[#dce2e8] bg-white text-[#64748b] flex items-center justify-center"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Shipments;
