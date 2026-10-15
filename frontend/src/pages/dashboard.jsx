import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { getDashboardData } from "../api/dashboardApi";
import sidebarLogo from "../assets/mipt-sidebar-logo.png";
import Topbar from "../components/topbar";
import Sidebar from "../components/sidebar";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    const loadDashboard = async () => {
      const result = await getDashboardData();

      if (result.success) {
        setDashboardData(result);
      }
    };

    loadDashboard();
  }, []);

  const shipments = [
    {
      product: "Wireless Earbuds",
      brand: "Brand A",
      status: "SHIPPED",
      shipped: "24 Sep 2026",
      received: "—",
      type: "shipped",
      icon: "🎧",
    },
    {
      product: "Skincare Kit",
      brand: "Brand B",
      status: "RECEIVED",
      shipped: "20 Sep 2026",
      received: "24 Sep 2026",
      type: "received",
      icon: "🧴",
    },
    {
      product: "Hair Care Set",
      brand: "Brand C",
      status: "SHIPPED",
      shipped: "22 Sep 2026",
      received: "—",
      type: "shipped",
      icon: "🧴",
    },
    {
      product: "Fitness Band",
      brand: "Brand A",
      status: "RECEIVED",
      shipped: "18 Sep 2026",
      received: "21 Sep 2026",
      type: "received",
      icon: "⌚",
    },
    {
      product: "Travel Kit",
      brand: "Brand D",
      status: "SHIPPED",
      shipped: "24 Sep 2026",
      received: "—",
      type: "shipped",
      icon: "👜",
    },
  ];

  const displayShipments = dashboardData?.recentShipments || shipments;

  const deadlines = [
    {
      platform: "Instagram",
      platformIcon: "◎",
      product: "Skincare Kit",
      dueDate: "26 Sep 2026",
      status: "UPCOMING",
      type: "upcoming",
    },
    {
      platform: "YouTube",
      platformIcon: "▶",
      product: "Wireless Earbuds",
      dueDate: "27 Sep 2026",
      status: "UPCOMING",
      type: "upcoming",
    },
    {
      platform: "TikTok",
      platformIcon: "♪",
      product: "Hair Care Set",
      dueDate: "28 Sep 2026",
      status: "OVERDUE",
      type: "overdue",
    },
    {
      platform: "Instagram",
      platformIcon: "◎",
      product: "Fitness Band",
      dueDate: "30 Sep 2026",
      status: "UPCOMING",
      type: "upcoming",
    },
    {
      platform: "YouTube",
      platformIcon: "▶",
      product: "Travel Kit",
      dueDate: "03 Oct 2026",
      status: "UPCOMING",
      type: "upcoming",
    },
  ];

  const displayDeadlines = dashboardData?.upcomingDeadlines || deadlines;

  const brands = [
    {
      name: "Brand A",
      website: "www.branda.com",
      products: 3,
      shipments: 2,
      updated: "24 Sep 2026",
    },
    {
      name: "Brand B",
      website: "www.brandb.com",
      products: 2,
      shipments: 1,
      updated: "22 Sep 2026",
    },
    {
      name: "Brand C",
      website: "www.brandc.com",
      products: 1,
      shipments: 1,
      updated: "20 Sep 2026",
    },
    {
      name: "Brand D",
      website: "www.brandd.com",
      products: 1,
      shipments: 1,
      updated: "18 Sep 2026",
    },
  ];

  const stats = [
    {
      title: "Brands",
      value: dashboardData?.stats?.totalBrands ?? 4,
      link: "/brands",
      linkText: "View all brands",
      icon: "◇",
      iconBg: "bg-[#e6f0ff]",
      iconColor: "text-[#2875c7]",
    },
    {
      title: "Products",
      value: dashboardData?.stats?.totalProducts ?? 7,
      link: "/products",
      linkText: "View all products",
      icon: "⬡",
      iconBg: "bg-[#f0e7ff]",
      iconColor: "text-[#8054c7]",
    },
    {
      title: "Shipments",
      value: dashboardData?.stats?.activeShipments ?? 5,
      link: "/shipments",
      linkText: "View all shipments",
      icon: "▱",
      iconBg: "bg-[#fff0e3]",
      iconColor: "text-[#e88b32]",
    },
    {
      title: "Content Deadlines",
      value: dashboardData?.stats?.upcomingDeadlines ?? 9,
      link: "/deadlines",
      linkText: "View all deadlines",
      icon: "▣",
      iconBg: "bg-[#e1f6ed]",
      iconColor: "text-[#168a70]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f6fb] text-[#102f47]">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN ================= */}
      <main className="lg:ml-[243px] min-h-screen min-w-0">
        {/* ================= TOPBAR ================= */}
        <Topbar />

        {/* ================= CONTENT ================= */}
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          {/* Heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
            <div>
              <h1 className="text-[29px] leading-none font-bold text-[#102f47]">
                Dashboard
              </h1>

              <p className="mt-2 text-[12px] text-[#718398]">
                Track your PR packages, shipments and content deadlines all in
                one place.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#64778b] mt-1">
              <span className="text-[17px]">▣</span>
              {formattedDate}
            </div>
          </div>

          {/* ================= STAT CARDS ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white border border-[#e0e7ed] rounded-[6px] px-4 py-4 min-h-[126px] shadow-[0_1px_3px_rgba(16,47,71,0.03)]"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-[55px] h-[55px] rounded-full ${stat.iconBg} ${stat.iconColor} flex items-center justify-center text-[26px] shrink-0`}
                  >
                    {stat.icon}
                  </div>

                  <div className="pt-1">
                    <p className="text-[12px] font-semibold text-[#30485f]">
                      {stat.title}
                    </p>

                    <h2 className="text-[27px] leading-none font-bold text-[#102f47] mt-2">
                      {stat.value}
                    </h2>

                    <Link
                      to={stat.link}
                      className="inline-flex items-center gap-2 text-[10px] text-[#3974a6] mt-3 hover:text-[#f26a21]"
                    >
                      {stat.linkText}
                      <span className="text-[14px]">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* ================= TWO COLUMN AREA ================= */}
          <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5">
            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-5">
              {/* Recent Shipments */}
              <div className="bg-white border border-[#e0e7ed] rounded-[6px] overflow-hidden">
                <div className="px-4 py-4 flex items-center justify-between border-b border-[#edf1f4]">
                  <div className="flex items-center gap-3">
                    <span className="text-[22px] text-[#102f47]">▱</span>

                    <h2 className="text-[15px] font-bold text-[#102f47]">
                      Recent Shipments
                    </h2>
                  </div>

                  <Link
                    to="/shipments"
                    className="text-[10px] text-[#4b82ad] hover:text-[#f26a21]"
                  >
                    View all →
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#f2f6fa] text-[#63788c] text-[9px]">
                        <th className="px-3 py-2.5 font-semibold">Product</th>
                        <th className="px-3 py-2.5 font-semibold">Brand</th>
                        <th className="px-3 py-2.5 font-semibold">Status</th>
                        <th className="px-3 py-2.5 font-semibold">Shipped</th>
                        <th className="px-3 py-2.5 font-semibold">Received</th>
                        <th className="px-3 py-2.5 font-semibold">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {displayShipments.map((shipment, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#edf1f4] last:border-0 hover:bg-[#fafcfe]"
                        >
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-[34px] h-[34px] rounded-[5px] bg-[#f1f3f5] flex items-center justify-center text-[18px]">
                                {shipment.icon}
                              </div>

                              <span className="text-[10px] font-medium text-[#3d5267]">
                                {shipment.product}
                              </span>
                            </div>
                          </td>

                          <td className="px-3 py-2 text-[10px] text-[#66788a]">
                            {shipment.brand}
                          </td>

                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-semibold ${
                                shipment.type === "shipped"
                                  ? "bg-[#fff1df] text-[#e58a25]"
                                  : "bg-[#def5ed] text-[#16866c]"
                              }`}
                            >
                              <span
                                className={`w-[6px] h-[6px] rounded-full ${
                                  shipment.type === "shipped"
                                    ? "bg-[#ed8a22]"
                                    : "bg-[#16866c]"
                                }`}
                              ></span>

                              {shipment.status}
                            </span>
                          </td>

                          <td className="px-3 py-2 text-[10px] text-[#66788a]">
                            {shipment.shipped}
                          </td>

                          <td className="px-3 py-2 text-[10px] text-[#66788a]">
                            {shipment.received}
                          </td>

                          <td className="px-3 py-2">
                            <Link
                              to="/shipments"
                              className="inline-flex items-center justify-center border border-[#d5dfe7] rounded-[4px] px-4 py-1.5 text-[9px] text-[#4c6175] hover:border-[#f26a21] hover:text-[#f26a21]"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Brands Overview */}
              <div className="bg-white border border-[#e0e7ed] rounded-[6px] overflow-hidden">
                <div className="px-4 py-4 flex items-center justify-between border-b border-[#edf1f4]">
                  <div className="flex items-center gap-3">
                    <span className="text-[22px] text-[#102f47]">◇</span>

                    <h2 className="text-[15px] font-bold text-[#102f47]">
                      Brands Overview
                    </h2>
                  </div>

                  <Link
                    to="/brands"
                    className="text-[10px] text-[#4b82ad] hover:text-[#f26a21]"
                  >
                    View all →
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#f2f6fa] text-[#63788c] text-[9px]">
                        <th className="px-3 py-2.5 font-semibold">
                          Brand Name
                        </th>
                        <th className="px-3 py-2.5 font-semibold">Website</th>
                        <th className="px-3 py-2.5 font-semibold">Products</th>
                        <th className="px-3 py-2.5 font-semibold">Shipments</th>
                        <th className="px-3 py-2.5 font-semibold">Updated</th>
                        <th className="px-3 py-2.5 font-semibold">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {brands.map((brand) => (
                        <tr
                          key={brand.name}
                          className="border-b border-[#edf1f4] last:border-0"
                        >
                          <td className="px-3 py-2 text-[10px] text-[#3d5267]">
                            {brand.name}
                          </td>

                          <td className="px-3 py-2">
                            <a
                              href="#"
                              className="text-[10px] text-[#2382ba] hover:underline"
                            >
                              {brand.website}
                            </a>
                          </td>

                          <td className="px-3 py-2 text-[10px] text-[#66788a]">
                            {brand.products}
                          </td>

                          <td className="px-3 py-2 text-[10px] text-[#66788a]">
                            {brand.shipments}
                          </td>

                          <td className="px-3 py-2 text-[10px] text-[#66788a]">
                            {brand.updated}
                          </td>

                          <td className="px-3 py-2">
                            <Link
                              to="/brands"
                              className="inline-flex items-center justify-center border border-[#d5dfe7] rounded-[4px] px-4 py-1.5 text-[9px] text-[#4c6175] hover:border-[#f26a21] hover:text-[#f26a21]"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="space-y-5">
              {/* Upcoming Deadlines */}
              <div className="bg-white border border-[#e0e7ed] rounded-[6px] overflow-hidden">
                <div className="px-4 py-4 flex items-center justify-between border-b border-[#edf1f4]">
                  <div className="flex items-center gap-3">
                    <span className="text-[21px] text-[#102f47]">▣</span>

                    <h2 className="text-[15px] font-bold text-[#102f47]">
                      Upcoming Deadlines
                    </h2>
                  </div>

                  <Link
                    to="/deadlines"
                    className="text-[10px] text-[#4b82ad] hover:text-[#f26a21]"
                  >
                    View all →
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#f2f6fa] text-[#63788c] text-[9px]">
                        <th className="px-3 py-2.5 font-semibold">Platform</th>
                        <th className="px-3 py-2.5 font-semibold">Product</th>
                        <th className="px-3 py-2.5 font-semibold">Due Date</th>
                        <th className="px-3 py-2.5 font-semibold">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {displayDeadlines.map((deadline, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#edf1f4] last:border-0"
                        >
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-[27px] h-[27px] rounded-[5px] flex items-center justify-center text-white text-[13px] font-bold ${
                                  deadline.platform === "Instagram"
                                    ? "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]"
                                    : deadline.platform === "YouTube"
                                      ? "bg-[#ff0000]"
                                      : "bg-[#111111]"
                                }`}
                              >
                                {deadline.platformIcon}
                              </div>

                              <span className="text-[9px] text-[#51677b]">
                                {deadline.platform}
                              </span>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 text-[9px] text-[#66788a]">
                            {deadline.product}
                          </td>

                          <td className="px-3 py-2.5 text-[9px] text-[#66788a]">
                            {deadline.dueDate}
                          </td>

                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-semibold ${
                                deadline.type === "overdue"
                                  ? "bg-[#fde2e2] text-[#d93636]"
                                  : "bg-[#fff1df] text-[#e58a25]"
                              }`}
                            >
                              <span
                                className={`w-[6px] h-[6px] rounded-full ${
                                  deadline.type === "overdue"
                                    ? "bg-[#d93636]"
                                    : "bg-[#ed8a22]"
                                }`}
                              ></span>

                              {deadline.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Overdue Alert */}
                <Link to="/deadlines" className="block mx-3 my-3 no-underline">
                  <div className="bg-[#fff0f0] border border-[#f4d2d2] rounded-[6px] px-3 py-3 flex items-center gap-3 hover:bg-[#ffe8e8] transition cursor-pointer">
                    <div className="w-[29px] h-[29px] rounded-full bg-[#d93636] text-white flex items-center justify-center font-bold text-[14px]">
                      !
                    </div>

                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-[#c73535]">
                        1 deadline is overdue
                      </p>

                      <p className="text-[9px] text-[#8a6666] mt-0.5">
                        TikTok · Hair Care Set · 28 Sep 2026
                      </p>
                    </div>

                    <span className="text-[#a46d6d] text-[15px]">→</span>
                  </div>
                </Link>
              </div>

              {/* Content Deadline Summary */}
              <div className="bg-white border border-[#e0e7ed] rounded-[6px] overflow-hidden">
                <div className="px-4 py-4 flex items-center justify-between border-b border-[#edf1f4]">
                  <div className="flex items-center gap-3">
                    <span className="text-[21px] text-[#102f47]">▣</span>

                    <h2 className="text-[15px] font-bold text-[#102f47]">
                      Content Deadline Summary
                    </h2>
                  </div>

                  <Link
                    to="/deadlines"
                    className="text-[10px] text-[#4b82ad] hover:text-[#f26a21]"
                  >
                    View all →
                  </Link>
                </div>

                <div className="px-6 py-6 flex items-center justify-center gap-8">
                  {/* Donut */}
                  <div className="relative w-[132px] h-[132px] rounded-full bg-[conic-gradient(#ef8a22_0deg_200deg,#d93636_200deg_240deg,#16866c_240deg_360deg)] flex items-center justify-center">
                    <div className="w-[84px] h-[84px] rounded-full bg-white flex flex-col items-center justify-center">
                      <strong className="text-[21px] font-bold text-[#102f47]">
                        9
                      </strong>

                      <span className="text-[9px] text-[#7b8b9a]">Total</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-[9px] h-[9px] rounded-full bg-[#ef8a22]"></span>
                      <span className="text-[#64778b]">Upcoming</span>
                      <strong className="ml-5 text-[#30485f]">5</strong>
                    </div>

                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-[9px] h-[9px] rounded-full bg-[#d93636]"></span>
                      <span className="text-[#64778b]">Overdue</span>
                      <strong className="ml-6 text-[#30485f]">1</strong>
                    </div>

                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-[9px] h-[9px] rounded-full bg-[#16866c]"></span>
                      <span className="text-[#64778b]">Completed</span>
                      <strong className="ml-3 text-[#30485f]">3</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
