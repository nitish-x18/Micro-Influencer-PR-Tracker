import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "../components/topbar";
import Sidebar from "../components/sidebar";

function AddContentDeadline() {
  const navigate = useNavigate();

  const [shipment, setShipment] = useState("");
  const [platform, setPlatform] = useState("");

  const shipments = JSON.parse(localStorage.getItem("mipt_shipments")) || [];

  const selectedShipment = shipments.find(
    (item) => String(item.id) === String(shipment),
  );
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!shipment || !platform || !dueDate) {
      alert("Please fill all required fields.");
      return;
    }

    const newDeadline = {
      id: Date.now(),
      platform,
      product: selectedShipment?.product || "Unknown Product",
      shipment: `Shipment #${selectedShipment.id}`,
      dueDate: new Date(`${dueDate}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "UPCOMING",
      notes,
    };

    const existingDeadlines =
      JSON.parse(localStorage.getItem("mipt_deadlines")) || [];

    localStorage.setItem(
      "mipt_deadlines",
      JSON.stringify([...existingDeadlines, newDeadline]),
    );

    alert("Content deadline created successfully!");

    navigate("/deadlines");
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-[#17324d]">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN ================= */}
      <div className="lg:ml-[243px] min-h-screen min-w-0">
        {/* ================= TOPBAR ================= */}
        <Topbar />

        {/* ================= PAGE CONTENT ================= */}
        <main className="px-4 sm:px-6 lg:px-[30px] pt-5 sm:pt-[25px] pb-8 sm:pb-[50px]">
          {/* Back */}
          <Link
            to="/deadlines"
            className="inline-flex items-center gap-3 text-[12px] text-[#17324d] hover:text-[#e96a28] transition mb-[8px]"
          >
            <span className="text-[20px] leading-none">←</span>
            <span>Back to Content Deadlines</span>
          </Link>

          {/* Heading */}
          <div className="mb-[20px]">
            <h1 className="text-[38px] leading-[43px] font-bold text-[#17324d]">
              Add Content Deadline
            </h1>

            <p className="mt-1 text-[15px] text-[#50657b]">
              Create a new content deadline for a shipment.
            </p>
          </div>

          {/* ================= FORM CARD ================= */}
          <form onSubmit={handleSubmit}>
            <section className="bg-white border border-[#dfe6ed] rounded-[7px] px-[20px] pt-[21px] pb-[30px]">
              <h2 className="text-[16px] font-bold text-[#17324d] mb-[21px]">
                Content Deadline Information
              </h2>

              {/* Shipment + Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-[25px]">
                {/* Shipment */}
                <div>
                  <label className="block text-[12px] text-[#17324d] mb-[8px]">
                    Shipment <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={shipment}
                    onChange={(e) => setShipment(e.target.value)}
                    className="w-full h-[39px] border border-[#d8e0e8] rounded-[6px] px-3 text-[12px] text-[#8093a8] bg-white outline-none focus:border-[#8ca0b4]"
                  >
                    <option value="">Select a shipment</option>

                    {shipments.map((item) => (
                      <option key={item.id} value={item.id}>
                        Shipment #{item.id} — {item.product}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-[12px] text-[#17324d] mb-[8px]">
                    Platform <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full h-[39px] border border-[#d8e0e8] rounded-[6px] px-3 text-[12px] text-[#8093a8] bg-white outline-none focus:border-[#8ca0b4]"
                  >
                    <option value="">Select a platform</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Blog">Blog</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div className="w-full sm:w-1/2 sm:pr-[12px] mt-[26px]">
                <label className="block text-[12px] text-[#17324d] mb-[8px]">
                  Due Date <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-[39px] border border-[#d8e0e8] rounded-[6px] px-3 text-[12px] text-[#8093a8] bg-white outline-none focus:border-[#8ca0b4]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mt-[25px]">
                <label className="block text-[12px] text-[#17324d] mb-[8px]">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setNotes(e.target.value);
                    }
                  }}
                  placeholder="Enter notes (optional)"
                  rows="4"
                  className="w-full border border-[#d8e0e8] rounded-[6px] px-3 py-3 text-[12px] text-[#17324d] outline-none resize-none focus:border-[#8ca0b4]"
                />

                <div className="text-right text-[11px] text-[#7b8ea3] mt-1">
                  {notes.length}/500
                </div>
              </div>
            </section>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-[10px] sm:gap-[14px] mt-[22px]">
              <button
                type="button"
                onClick={() => navigate("/deadlines")}
                className="h-[40px] w-full sm:w-auto min-w-[136px] px-6 rounded-[6px]  border border-[#d4dde6] bg-white text-[#40566d] text-[12px] font-semibold hover:bg-[#f6f8fa] transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-[40px] w-full sm:w-auto min-w-[141px] px-6 rounded-[6px] bg-[#e96a28] hover:bg-[#d95d1e] text-white text-[12px] font-semibold transition"
              >
                Create Deadline
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */

/* ================= SIDEBAR ITEM ================= */

function NavItem({ to, label, icon, active = false }) {
  return (
    <NavLink
      to={to}
      className={`flex items-center gap-4 h-[46px] px-[14px] rounded-[7px] mb-2 text-[13px] transition ${
        active
          ? "bg-[#f26a21] text-white font-semibold"
          : "text-[#d7e0e9] hover:bg-white/10"
      }`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>

      <span>{label}</span>
    </NavLink>
  );
}

export default AddContentDeadline;
