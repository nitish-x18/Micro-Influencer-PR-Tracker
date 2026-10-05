import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/topbar";
import Sidebar from "../components/sidebar";

function ContentDeadlines() {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All Platforms");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const [deadlines, setDeadlines] = useState(() => {
    const savedDeadlines = localStorage.getItem("mipt_deadlines");

    if (savedDeadlines) {
      return JSON.parse(savedDeadlines);
    }

    return [
      {
        id: 1,
        platform: "Instagram",
        product: "Skincare Kit",
        shipment: "Shipment #3",
        dueDate: "26 Sep 2026",
        status: "UPCOMING",
      },
      {
        id: 2,
        platform: "YouTube",
        product: "Wireless Earbuds",
        shipment: "Shipment #2",
        dueDate: "27 Sep 2026",
        status: "UPCOMING",
      },
      {
        id: 3,
        platform: "TikTok",
        product: "Hair Care Set",
        shipment: "Shipment #4",
        dueDate: "28 Sep 2026",
        status: "UPCOMING",
      },
      {
        id: 4,
        platform: "Instagram",
        product: "Fitness Band",
        shipment: "Shipment #1",
        dueDate: "30 Sep 2026",
        status: "UPCOMING",
      },
      {
        id: 5,
        platform: "Blog",
        product: "Travel Kit",
        shipment: "Shipment #5",
        dueDate: "03 Oct 2026",
        status: "UPCOMING",
      },
      {
        id: 6,
        platform: "YouTube",
        product: "Makeup Set",
        shipment: "Shipment #2",
        dueDate: "05 Oct 2026",
        status: "COMPLETED",
      },
      {
        id: 7,
        platform: "TikTok",
        product: "Sunscreen",
        shipment: "Shipment #3",
        dueDate: "08 Oct 2026",
        status: "UPCOMING",
      },
      {
        id: 8,
        platform: "Other",
        product: "Backpack",
        shipment: "Shipment #6",
        dueDate: "12 Oct 2026",
        status: "COMPLETED",
      },
    ];
  });

  const [newDeadline, setNewDeadline] = useState({
    platform: "Instagram",
    product: "",
    shipment: "",
    dueDate: "",
    status: "UPCOMING",
  });

  const filteredDeadlines = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return deadlines.filter((deadline) => {
      const matchesSearch =
        deadline.platform.toLowerCase().includes(searchText) ||
        deadline.product.toLowerCase().includes(searchText) ||
        deadline.shipment.toLowerCase().includes(searchText) ||
        deadline.dueDate.toLowerCase().includes(searchText) ||
        deadline.status.toLowerCase().includes(searchText);

      const matchesPlatform =
        platformFilter === "All Platforms" ||
        deadline.platform === platformFilter;

      const matchesStatus =
        statusFilter === "All Statuses" || deadline.status === statusFilter;

      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [deadlines, search, platformFilter, statusFilter]);

  // Delete Deadline
  const handleDeleteDeadline = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this deadline?",
    );

    if (!confirmDelete) {
      return;
    }

    setDeadlines((prev) => {
      const updatedDeadlines = prev.filter((deadline) => deadline.id !== id);

      localStorage.setItem("mipt_deadlines", JSON.stringify(updatedDeadlines));

      return updatedDeadlines;
    });
  };
  // Edit Deadline
  const handleEditDeadline = (deadline) => {
    setSelectedDeadline({
      ...deadline,
      isEditing: true,
    });
  };

  // Save Edited Deadline
  const handleSaveEditedDeadline = () => {
    if (
      !selectedDeadline.platform ||
      !selectedDeadline.product ||
      !selectedDeadline.shipment ||
      !selectedDeadline.dueDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const updatedDeadline = {
      ...selectedDeadline,
    };

    delete updatedDeadline.isEditing;

    setDeadlines((prev) => {
      const updatedDeadlines = prev.map((deadline) =>
        deadline.id === updatedDeadline.id ? updatedDeadline : deadline,
      );

      localStorage.setItem("mipt_deadlines", JSON.stringify(updatedDeadlines));

      return updatedDeadlines;
    });

    setSelectedDeadline(null);
  };
  const handleAddDeadline = (e) => {
    e.preventDefault();

    if (
      !newDeadline.platform ||
      !newDeadline.product ||
      !newDeadline.shipment ||
      !newDeadline.dueDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const formattedDate = new Date(
      `${newDeadline.dueDate}T00:00:00`,
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const deadline = {
      id: Date.now(),
      platform: newDeadline.platform,
      product: newDeadline.product,
      shipment: newDeadline.shipment,
      dueDate: formattedDate,
      status: newDeadline.status,
    };
    setDeadlines((prev) => {
      const updatedDeadlines = [...prev, deadline];

      localStorage.setItem("mipt_deadlines", JSON.stringify(updatedDeadlines));

      return updatedDeadlines;
    });

    setNewDeadline({
      platform: "Instagram",
      product: "",
      shipment: "",
      dueDate: "",
      status: "UPCOMING",
    });

    setShowAddModal(false);
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
        <main className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-[28px] pb-8 sm:pb-[40px]">
          {/* Heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-[24px]">
            <div>
              <h1 className="text-[36px] leading-[42px] font-bold text-[#17324d]">
                Content Deadlines
              </h1>

              <p className="mt-1 text-[14px] text-[#50657b]">
                Track your content deadlines and make sure you never miss a
                post.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[#50657b] text-[11px] mt-7">
              <svg
                width="18"
                height="18"
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

              <span>{formattedDate}</span>
            </div>
          </div>

          {/* ================= FILTER BAR ================= */}
          <section className="bg-white border border-[#e1e7ed] rounded-[7px] px-[18px] py-[22px] mb-[18px]">
            <div className="flex flex-col xl:flex-row xl:items-center gap-3 xl:gap-[15px]">
              {/* Search */}
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
                  placeholder="Search deadlines..."
                  className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] pl-11 pr-4 text-[12px] text-[#17324d] outline-none focus:border-[#9baabb]"
                />
              </div>

              {/* Platform */}
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full xl:w-[255px] h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] text-[#34495e] bg-white outline-none"
              >
                <option>All Platforms</option>
                <option>Instagram</option>
                <option>YouTube</option>
                <option>TikTok</option>
                <option>Blog</option>
                <option>Other</option>
              </select>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full xl:w-[255px] h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] text-[#34495e] bg-white outline-none"
              >
                <option>All Statuses</option>
                <option>UPCOMING</option>
                <option>COMPLETED</option>
              </select>

              {/* Add Deadline */}
              <Link
                to="/deadlines/add"
                className="h-[44px] w-full xl:w-auto xl:min-w-[141px] px-5 rounded-[6px] bg-[#e96a28] hover:bg-[#d95d1e] text-white text-[12px] font-semibold flex items-center justify-center gap-2 transition"
              >
                <span className="text-[21px] font-light leading-none">+</span>

                <span>Add Deadline</span>
              </Link>
            </div>
          </section>

          {/* ================= TABLE ================= */}
          <section className="bg-white border border-[#e1e7ed] rounded-[7px] overflow-hidden">
            <div className="px-[18px] pt-[19px]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f7f9fb]">
                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Platform
                      </th>

                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Product
                      </th>

                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Shipment
                      </th>

                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        <span className="inline-flex items-center gap-1">
                          Due Date
                          <span className="text-[12px]">⌃</span>
                        </span>
                      </th>

                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Status
                      </th>

                      <th className="text-left px-[11px] py-[13px] text-[11px] font-bold text-[#40566d]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDeadlines.map((deadline) => (
                      <tr
                        key={deadline.id}
                        className="border-b border-[#e7ebef] last:border-b-0 hover:bg-[#fbfcfd] transition"
                      >
                        {/* Platform */}
                        <td className="px-[11px] py-[13px]">
                          <div className="flex items-center gap-3">
                            {deadline.platform === "Instagram" && (
                              <div className="w-[27px] h-[27px] rounded-[7px] bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center font-bold text-[15px]">
                                ◎
                              </div>
                            )}

                            {deadline.platform === "YouTube" && (
                              <div className="w-[27px] h-[19px] rounded-[5px] bg-[#ef2020] text-white flex items-center justify-center text-[11px]">
                                ▶
                              </div>
                            )}

                            {deadline.platform === "TikTok" && (
                              <div className="w-[27px] h-[27px] rounded-[7px] bg-black text-white flex items-center justify-center font-bold text-[13px]">
                                ♪
                              </div>
                            )}

                            {deadline.platform === "Blog" && (
                              <div className="w-[27px] h-[27px] rounded-[5px] bg-[#17324d] text-white flex items-center justify-center text-[16px]">
                                ▤
                              </div>
                            )}

                            {deadline.platform === "Other" && (
                              <div className="w-[27px] h-[27px] rounded-full bg-[#17324d] text-white flex items-center justify-center text-[15px]">
                                •••
                              </div>
                            )}

                            <span className="text-[12px] text-[#40566d]">
                              {deadline.platform}
                            </span>
                          </div>
                        </td>

                        {/* Product */}
                        <td className="px-[11px] py-[13px] text-[12px] text-[#40566d]">
                          {deadline.product}
                        </td>

                        {/* Shipment */}
                        <td className="px-[11px] py-[13px] text-[12px] text-[#40566d]">
                          {deadline.shipment}
                        </td>

                        {/* Date */}
                        <td className="px-[11px] py-[13px] text-[12px] text-[#40566d]">
                          {deadline.dueDate}
                        </td>

                        {/* Status */}
                        <td className="px-[11px] py-[13px]">
                          {deadline.status === "UPCOMING" ? (
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff3df] px-3 py-[5px] text-[10px] font-semibold text-[#e87517]">
                              <span className="w-[8px] h-[8px] rounded-full bg-[#ef8a19] flex items-center justify-center text-white">
                                !
                              </span>
                              UPCOMING
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#e0f5ed] px-3 py-[5px] text-[10px] font-semibold text-[#158064]">
                              <span className="w-[8px] h-[8px] rounded-full bg-[#15906f] text-white flex items-center justify-center">
                                ✓
                              </span>
                              COMPLETED
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-[11px] py-[13px]">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedDeadline(deadline)}
                              className="h-[30px] min-w-[65px] px-3 rounded-[6px] border border-[#d7dfe7] bg-white text-[11px] text-[#40566d] hover:bg-[#f5f7f9] transition"
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEditDeadline(deadline)}
                              className="h-[30px] min-w-[65px] px-3 rounded-[6px] border border-[#d7dfe7] bg-white text-[11px] text-[#e96a28] hover:bg-[#fff7f2] transition"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteDeadline(deadline.id)}
                              className="h-[30px] min-w-[65px] px-3 rounded-[6px] border border-[#f0caca] bg-white text-[11px] text-[#d9534f] hover:bg-[#fff5f5] transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredDeadlines.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-14 text-[13px] text-[#64748b]"
                        >
                          No deadlines found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="min-h-[77px] py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[11px] text-[#64748b]">
                  Showing 1-{filteredDeadlines.length} of{" "}
                  {filteredDeadlines.length} deadlines
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-[31px] h-[31px] rounded-[6px] border border-[#dce2e8] bg-white text-[#9aa7b4] flex items-center justify-center hover:bg-[#f5f7f9]"
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
                    className="w-[31px] h-[31px] rounded-[6px] border border-[#dce2e8] bg-white text-[#64748b] flex items-center justify-center hover:bg-[#f5f7f9]"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {selectedDeadline && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-[500px] bg-white rounded-[10px] shadow-2xl">
            <div className="px-6 py-5 border-b border-[#e5e9ee] flex items-center justify-between">
              <h2 className="text-[19px] font-bold text-[#17324d]">
                {selectedDeadline.isEditing
                  ? "Edit Deadline"
                  : "Deadline Details"}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedDeadline(null)}
                className="text-[24px] text-[#64748b] hover:text-[#17324d]"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {selectedDeadline.isEditing ? (
                <>
                  {/* Platform */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#40566d] mb-2">
                      Platform
                    </label>

                    <select
                      value={selectedDeadline.platform}
                      onChange={(e) =>
                        setSelectedDeadline({
                          ...selectedDeadline,
                          platform: e.target.value,
                        })
                      }
                      className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] outline-none"
                    >
                      <option>Instagram</option>
                      <option>YouTube</option>
                      <option>TikTok</option>
                      <option>Blog</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Product */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#40566d] mb-2">
                      Product
                    </label>

                    <input
                      type="text"
                      value={selectedDeadline.product}
                      onChange={(e) =>
                        setSelectedDeadline({
                          ...selectedDeadline,
                          product: e.target.value,
                        })
                      }
                      className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] outline-none"
                    />
                  </div>

                  {/* Shipment */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#40566d] mb-2">
                      Shipment
                    </label>

                    <input
                      type="text"
                      value={selectedDeadline.shipment}
                      onChange={(e) =>
                        setSelectedDeadline({
                          ...selectedDeadline,
                          shipment: e.target.value,
                        })
                      }
                      className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] outline-none"
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#40566d] mb-2">
                      Due Date
                    </label>

                    <input
                      type="text"
                      value={selectedDeadline.dueDate}
                      onChange={(e) =>
                        setSelectedDeadline({
                          ...selectedDeadline,
                          dueDate: e.target.value,
                        })
                      }
                      className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] outline-none"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#40566d] mb-2">
                      Status
                    </label>

                    <select
                      value={selectedDeadline.status}
                      onChange={(e) =>
                        setSelectedDeadline({
                          ...selectedDeadline,
                          status: e.target.value,
                        })
                      }
                      className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] outline-none"
                    >
                      <option>UPCOMING</option>
                      <option>COMPLETED</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {/* Platform */}
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[#64748b]">Platform</span>

                    <span className="text-[12px] font-semibold text-[#17324d]">
                      {selectedDeadline.platform}
                    </span>
                  </div>

                  {/* Product */}
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[#64748b]">Product</span>

                    <span className="text-[12px] font-semibold text-[#17324d]">
                      {selectedDeadline.product}
                    </span>
                  </div>

                  {/* Shipment */}
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[#64748b]">Shipment</span>

                    <span className="text-[12px] font-semibold text-[#17324d]">
                      {selectedDeadline.shipment}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[#64748b]">Due Date</span>

                    <span className="text-[12px] font-semibold text-[#17324d]">
                      {selectedDeadline.dueDate}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[#64748b]">Status</span>

                    <span
                      className={`text-[10px] font-semibold px-3 py-1 rounded-full ${
                        selectedDeadline.status === "UPCOMING"
                          ? "bg-[#fff3df] text-[#e87517]"
                          : "bg-[#e0f5ed] text-[#158064]"
                      }`}
                    >
                      {selectedDeadline.status}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#e5e9ee] flex justify-end gap-2">
              {selectedDeadline.isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedDeadline(null)}
                    className="h-[38px] px-5 rounded-[6px] border border-[#d7dfe7] bg-white text-[12px] font-semibold text-[#40566d] hover:bg-[#f5f7f9]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveEditedDeadline}
                    className="h-[38px] px-5 rounded-[6px] bg-[#e96a28] text-white text-[12px] font-semibold hover:bg-[#d95d1e]"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedDeadline(null)}
                  className="h-[38px] px-5 rounded-[6px] bg-[#17324d] text-white text-[12px]"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD DEADLINE MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-[540px] bg-white rounded-[10px] shadow-2xl">
            <div className="px-6 py-5 border-b border-[#e5e9ee] flex items-center justify-between">
              <h2 className="text-[19px] font-bold text-[#17324d]">
                Add Content Deadline
              </h2>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[24px] text-[#64748b] hover:text-[#17324d]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddDeadline}>
              <div className="px-6 py-6 space-y-4">
                {/* Platform */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#40566d] mb-2">
                    Platform
                  </label>

                  <select
                    value={newDeadline.platform}
                    onChange={(e) =>
                      setNewDeadline({
                        ...newDeadline,
                        platform: e.target.value,
                      })
                    }
                    className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] outline-none"
                  >
                    <option>Instagram</option>
                    <option>YouTube</option>
                    <option>TikTok</option>
                    <option>Blog</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Product */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#40566d] mb-2">
                    Product
                  </label>

                  <input
                    type="text"
                    value={newDeadline.product}
                    onChange={(e) =>
                      setNewDeadline({
                        ...newDeadline,
                        product: e.target.value,
                      })
                    }
                    placeholder="Enter product name"
                    className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] outline-none focus:border-[#9baabb]"
                  />
                </div>

                {/* Shipment */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#40566d] mb-2">
                    Shipment
                  </label>

                  <input
                    type="text"
                    value={newDeadline.shipment}
                    onChange={(e) =>
                      setNewDeadline({
                        ...newDeadline,
                        shipment: e.target.value,
                      })
                    }
                    placeholder="Example: Shipment #7"
                    className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] outline-none focus:border-[#9baabb]"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#40566d] mb-2">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={newDeadline.dueDate}
                    onChange={(e) =>
                      setNewDeadline({
                        ...newDeadline,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] outline-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#40566d] mb-2">
                    Status
                  </label>

                  <select
                    value={newDeadline.status}
                    onChange={(e) =>
                      setNewDeadline({
                        ...newDeadline,
                        status: e.target.value,
                      })
                    }
                    className="w-full h-[40px] border border-[#d9e0e7] rounded-[6px] px-3 text-[12px] outline-none"
                  >
                    <option>UPCOMING</option>
                    <option>COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#e5e9ee] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-[38px] px-5 rounded-[6px] border border-[#d7dfe7] bg-white text-[#40566d] text-[12px]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-[6px] bg-[#e96a28] hover:bg-[#d95d1e] text-white text-[12px] font-semibold"
                >
                  Add Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentDeadlines;
