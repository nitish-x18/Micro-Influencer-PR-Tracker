import React from "react";
import { Link, useParams } from "react-router-dom";
import Topbar from "../components/topbar";
import Sidebar from "../components/sidebar";

function ShipmentDetail() {
  const { id } = useParams();

  const shipments = JSON.parse(localStorage.getItem("mipt_shipments")) || [];

  const shipment = shipments.find((item) => String(item.id) === String(id));

  if (!shipment) {
    return (
      <div className="min-h-screen bg-[#f3f6fa] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[24px] font-bold text-[#17324d]">
            Shipment Not Found
          </h1>

          <Link
            to="/shipments"
            className="inline-flex mt-4 px-5 py-2 rounded-[6px] bg-[#e96a28] text-white text-[12px] font-semibold"
          >
            Back to Shipments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-[#17324d]">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN AREA ================= */}
      <div className="lg:ml-[243px] min-h-screen min-w-0">
        {/* ================= TOPBAR ================= */}
        <Topbar />

        {/* ================= PAGE CONTENT ================= */}
        <main className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-[22px] pb-8 sm:pb-[40px]">
          {/* Back */}
          <Link
            to="/shipments"
            className="text-[12px] text-[#50657b] hover:text-[#17324d]"
          >
            ← Back to Shipments
          </Link>

          {/* Heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mt-2 mb-5">
            <div>
              <h1 className="text-[36px] leading-[42px] font-bold text-[#17324d]">
                Shipment Detail
              </h1>

              <p className="mt-1 text-[13px] text-[#64748b]">
                View shipment information, related brand and product details,
                and associated content deadlines.
              </p>
            </div>

            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#e0f5ed] px-4 py-2 text-[10px] font-semibold text-[#158064]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#15906f]"></span>
              {shipment.status}
            </span>
          </div>

          {/* ================= TOP INFORMATION ================= */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-[14px] mb-[14px]">
            {/* Shipment summary */}
            <section className="bg-white border border-[#e1e7ed] rounded-[7px] p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4">
                <div className="border-r border-[#e5eaf0] pr-5">
                  <p className="text-[10px] text-[#64748b]">Shipment ID</p>
                  <p className="mt-2 text-[14px] font-semibold text-[#17324d]">
                    SHP-{shipment.id}
                  </p>
                </div>

                <div className="border-r border-[#e5eaf0] px-5">
                  <p className="text-[10px] text-[#64748b]">Status</p>
                  <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#e0f5ed] px-3 py-1 text-[9px] font-semibold text-[#158064]">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#15906f]"></span>
                    {shipment.status}
                  </span>
                </div>

                <div className="border-r border-[#e5eaf0] px-5">
                  <p className="text-[10px] text-[#64748b]">Shipment Date</p>
                  <p className="mt-2 text-[12px] text-[#40566d]">
                    📅 {shipment.shipped}
                  </p>
                </div>

                <div className="pl-5">
                  <p className="text-[10px] text-[#64748b]">Received Date</p>
                  <p className="mt-2 text-[12px] text-[#40566d]">
                    📅 {shipment.received}
                  </p>
                </div>
              </div>
            </section>

            {/* Brand → Product → Shipment */}
            <section className="bg-white border border-[#e1e7ed] rounded-[7px] p-5">
              <h3 className="text-[12px] font-bold text-[#17324d] mb-4">
                Brand → Product → Shipment
              </h3>

              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-[36px] h-[36px] mx-auto rounded-full bg-[#f08ab7] flex items-center justify-center overflow-hidden">
                    {shipment.brandLogo ? (
                      <img
                        src={shipment.brandLogo}
                        alt={shipment.brand}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-[#17324d] font-semibold">
                        {shipment.brand?.charAt(0) || "B"}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] font-semibold">
                    {shipment.brand}
                  </p>
                </div>

                <span className="text-[#9aa7b4]">→</span>

                <div className="text-center">
                  <div className="w-[42px] h-[36px] mx-auto rounded-[7px] bg-[#f4eee9] flex items-center justify-center text-xl">
                    🎧
                  </div>
                  <p className="mt-2 text-[10px] font-semibold">
                    {shipment.product}
                  </p>
                  <p className="text-[8px] text-[#94a3b8]">(Product)</p>
                </div>

                <span className="text-[#9aa7b4]">→</span>

                <div className="text-center">
                  <div className="w-[36px] h-[36px] mx-auto rounded-full bg-[#e6eef5] flex items-center justify-center text-lg">
                    🚚
                  </div>
                  <p className="text-[9px]">Shipment #SHP-{shipment.id}</p>
                  <p className="text-[8px] text-[#94a3b8]">(Received)</p>
                </div>
              </div>
            </section>
          </div>

          {/* ================= BRAND + PRODUCT ================= */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.35fr] gap-[14px] mb-[14px]">
            {/* Brand Information */}
            <section className="bg-white border border-[#e1e7ed] rounded-[7px] p-5">
              <h3 className="text-[12px] font-bold text-[#17324d] mb-5">
                Brand Information
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[#f08ab7] flex items-center justify-center font-semibold">
                  C
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-[#17324d]">
                    {shipment.brand}
                  </p>
                  <p className="text-[9px] text-[#94a3b8]">
                    Premium lifestyle Brand
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 mt-5">
                <div className="border-r border-[#e5eaf0]">
                  <p className="text-[10px] text-[#64748b]">
                    ♧ &nbsp; Products
                  </p>
                  <p className="mt-2 text-[14px] font-semibold">2</p>
                </div>

                <div className="pl-5">
                  <p className="text-[10px] text-[#64748b]">
                    ◇ &nbsp; Shipments
                  </p>
                  <p className="mt-2 text-[14px] font-semibold">2</p>
                </div>
              </div>
            </section>

            {/* Product Information */}
            <section className="bg-white border border-[#e1e7ed] rounded-[7px] p-5">
              <h3 className="text-[12px] font-bold text-[#17324d] mb-5">
                Product Information
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-[48px] h-[48px] rounded-[8px] bg-[#f4eee9] flex items-center justify-center text-2xl">
                    🎧
                  </div>

                  <div>
                    <p className="text-[12px] font-semibold">
                      {shipment.product}
                    </p>

                    <p className="text-[9px] text-[#94a3b8] mt-1">Value</p>

                    <p className="text-[11px] font-semibold mt-1">INR 2,499</p>
                  </div>
                </div>

                <div className="border-l border-[#e5eaf0] pl-5 pr-5">
                  <p className="text-[9px] text-[#64748b]">Associated Brand</p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-[28px] h-[28px] rounded-full bg-[#f08ab7] flex items-center justify-center text-[11px] font-semibold">
                      C
                    </div>
                    <span className="text-[11px] font-semibold">
                      {shipment.brand}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================= DEADLINES + TIMELINE ================= */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.75fr] gap-[14px]">
            {/* Content Deadlines */}
            <section className="bg-white border border-[#e1e7ed] rounded-[7px] p-5">
              <h3 className="text-[12px] font-bold text-[#17324d] mb-4">
                Content Deadlines
              </h3>
              <div className="overflow-x-auto rounded-[6px]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f9fb]">
                      <th className="text-left px-3 py-3 text-[10px] font-semibold text-[#40566d]">
                        Platform
                      </th>
                      <th className="text-left px-3 py-3 text-[10px] font-semibold text-[#40566d]">
                        Due Date
                      </th>
                      <th className="text-left px-3 py-3 text-[10px] font-semibold text-[#40566d]">
                        Status
                      </th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-b border-[#e7ebef]">
                      <td className="px-3 py-3 text-[11px]">🟣 Instagram</td>
                      <td className="px-3 py-3 text-[11px] text-[#40566d]">
                        📅 30 Sep 2026
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-[#fff2df] px-3 py-1 text-[9px] font-semibold text-[#e87517]">
                          UPCOMING
                        </span>
                      </td>
                      <td className="text-right pr-3">
                        <Link
                          to="/deadlines"
                          className="inline-flex items-center justify-center text-[18px] text-[#9aa7b4] hover:text-[#e96a28] cursor-pointer"
                        >
                          ›
                        </Link>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e7ebef]">
                      <td className="px-3 py-3 text-[11px]">🔴 YouTube</td>
                      <td className="px-3 py-3 text-[11px] text-[#40566d]">
                        📅 05 Oct 2026
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-[#fff2df] px-3 py-1 text-[9px] font-semibold text-[#e87517]">
                          UPCOMING
                        </span>
                      </td>
                      <td className="text-right pr-3">
                        <Link
                          to="/deadlines"
                          className="inline-flex items-center justify-center text-[18px] text-[#9aa7b4] hover:text-[#e96a28] cursor-pointer"
                        >
                          ›
                        </Link>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-3 py-3 text-[11px]">⚫ TikTok</td>
                      <td className="px-3 py-3 text-[11px] text-[#40566d]">
                        📅 10 Oct 2026
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-[#fff2df] px-3 py-1 text-[9px] font-semibold text-[#e87517]">
                          UPCOMING
                        </span>
                      </td>
                      <td className="text-right pr-3">
                        <Link
                          to="/deadlines"
                          className="inline-flex items-center justify-center text-[18px] text-[#9aa7b4] hover:text-[#e96a28] cursor-pointer"
                        >
                          ›
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-[9px] text-[#94a3b8]">
                Showing 1-3 of 3 deadlines
              </p>
            </section>

            {/* Shipment Timeline */}
            <section className="bg-white border border-[#e1e7ed] rounded-[7px] p-5">
              <h3 className="text-[12px] font-bold text-[#17324d] mb-5">
                Shipment Timeline
              </h3>

              <div className="relative pl-9">
                <div className="absolute left-[11px] top-2 bottom-7 w-[2px] bg-[#dbe3ea]"></div>

                <div className="relative mb-8">
                  <div className="absolute left-[-29px] top-0 w-[26px] h-[26px] rounded-full bg-[#ef7d17] text-white flex items-center justify-center text-[12px]">
                    🚚
                  </div>

                  <p className="text-[11px] font-semibold">Shipped</p>

                  <p className="text-[9px] text-[#94a3b8] mt-1">18 Sep 2026</p>

                  <p className="text-[9px] text-[#94a3b8]">10:25 AM</p>
                </div>

                <div className="relative">
                  <div className="absolute left-[-29px] top-0 w-[26px] h-[26px] rounded-full bg-[#15906f] text-white flex items-center justify-center text-[14px]">
                    ✓
                  </div>

                  <p className="text-[11px] font-semibold">Received</p>

                  <p className="text-[9px] text-[#94a3b8] mt-1">22 Sep 2026</p>

                  <p className="text-[9px] text-[#94a3b8]">03:18 PM</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ShipmentDetail;
