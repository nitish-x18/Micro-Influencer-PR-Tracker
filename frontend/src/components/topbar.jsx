import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Topbar() {
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: "Upcoming deadline",
      message: "Instagram content is due soon.",
    },
    {
      id: 2,
      title: "Shipment update",
      message: "Your skincare package has been delivered.",
    },
    {
      id: 3,
      title: "New shipment",
      message: "A new PR package has been added.",
    },
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="min-h-[68px] bg-white border-b border-[#e1e7ed] flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
      {/* ================= SEARCH ================= */}
      <div className="w-full max-w-[390px] min-w-0 h-[40px] flex items-center gap-3 border border-[#d9e0e7] rounded-[6px] px-3 bg-white">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7a8998"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>

        <input
          type="text"
          placeholder="Search brands, products, shipments..."
          value={search}
          onChange={handleSearch}
          onKeyDown={handleSearchKeyDown}
          className="w-full outline-none border-none bg-transparent text-[13px] text-[#40566d] placeholder:text-[#9aa7b4]"
        />
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center gap-2 sm:gap-5 shrink-0">
        {/* ================= NOTIFICATIONS ================= */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[#f3f6fa] transition"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#40566d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-[#e96a28]"></span>
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-[45px] w-[calc(100vw-32px)] max-w-[320px] bg-white border border-[#e1e7ed] rounded-[7px] shadow-lg z-[9999] overflow-hidden">
              <div className="h-[48px] px-4 flex items-center justify-between border-b border-[#e8edf2]">
                <strong className="text-[13px] text-[#0a1d2e]">
                  Notifications
                </strong>

                <span className="min-w-[22px] h-[22px] px-1 rounded-full bg-[#f3f6fa] flex items-center justify-center text-[11px] text-[#66788a]">
                  {notifications.length}
                </span>
              </div>

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 border-b border-[#edf1f5] last:border-b-0 hover:bg-[#f8fafc] transition"
                >
                  <strong className="block text-[12px] text-[#0a1d2e] mb-1">
                    {notification.title}
                  </strong>

                  <p className="text-[11px] leading-[17px] text-[#66788a] m-0">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= ACCOUNT ================= */}
        <Link
          to="/profile"
          className="flex items-center gap-2 no-underline cursor-pointer"
        >
          <span className="w-[34px] h-[34px] rounded-full bg-[#e96a28] text-white flex items-center justify-center text-[12px] font-semibold">
            JD
          </span>

          <span className="text-[#40566d] flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </Link>
      </div>
    </header>
  );
}

export default Topbar;
