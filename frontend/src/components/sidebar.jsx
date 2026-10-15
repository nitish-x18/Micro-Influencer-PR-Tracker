import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import sidebarLogo from "../assets/mipt-sidebar-logo.png";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const savedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Jane Doe",
    email: "jane@example.com",
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-7h6v7" />
        </svg>
      ),
    },
    {
      name: "Brands",
      path: "/brands",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.6 13.4L13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1 0-2.8l7.2-7.2A2 2 0 0 1 12 2.8h6.2a2 2 0 0 1 2 2V11a2 2 0 0 1 .4 2.4Z" />
          <circle cx="16.5" cy="7.5" r="1.2" />
        </svg>
      ),
    },
    {
      name: "Products",
      path: "/products",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3 20 7.5 12 12 4 7.5 12 3Z" />
          <path d="M4 7.5V16.5L12 21L20 16.5V7.5" />
          <path d="M12 12v9" />
        </svg>
      ),
    },
    {
      name: "Shipments",
      path: "/shipments",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="6" width="11" height="10" rx="1" />
          <path d="M14 9h4l3 3v4h-7" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      ),
    },
    {
      name: "Content Deadlines",
      path: "/deadlines",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
          <path d="M8 14h3" />
          <path d="M8 18h6" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* ================= MOBILE MENU BUTTON ================= */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-[40px] h-[40px] rounded-[6px] bg-[#0a1d2e] text-white flex items-center justify-center shadow-md"
        aria-label="Open menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* ================= MOBILE OVERLAY ================= */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-[45] bg-black/40"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed left-0 top-0 z-[50]
          w-[243px] h-screen
          bg-[#0a1d2e] text-white
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ================= LOGO ================= */}
        <div className="h-[92px] flex items-center justify-center px-4">
          <img
            src={sidebarLogo}
            alt="MIPT PR Package Tracker"
            className="w-[205px] h-auto object-contain"
          />
        </div>

        {/* ================= CLOSE BUTTON - MOBILE ================= */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-5 right-4 w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#b8c5d1] hover:bg-[#132b40] hover:text-white"
          aria-label="Close menu"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        {/* ================= MENU ================= */}
        <nav className="px-3 flex-1">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `h-[43px] px-4 rounded-[6px] flex items-center gap-3 text-[13px] font-medium transition ${
                    isActive
                      ? "bg-[#e96a28] text-white"
                      : "text-[#b8c5d1] hover:bg-[#132b40] hover:text-white"
                  }`
                }
              >
                <span className="flex items-center justify-center">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ================= BOTTOM PROFILE ================= */}
        <div className="px-3 pb-5">
          <div className="border-t border-[#294054] mb-4"></div>

          {/* Profile */}
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="h-[43px] px-4 rounded-[6px] flex items-center gap-3 text-[#b8c5d1] hover:bg-[#132b40] hover:text-white transition no-underline"
          >
            <div className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] shrink-0 rounded-full bg-[#f2f2f2] text-[#17324d] flex items-center justify-center text-[13px] font-medium">
              {savedUser.name
                ? savedUser.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "JD"}
            </div>

            <div>
              <div className="text-white text-[13px] font-medium">
                {savedUser.name}
              </div>

              <div className="text-[#b8c5d1] text-[11px] mt-0.5">
                {savedUser.email}
              </div>
            </div>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="w-full h-[40px] mt-3 px-4 rounded-[6px] flex items-center gap-3 text-[#b8c5d1] hover:bg-[#132b40] hover:text-white transition text-left"
          >
            <span className="text-[18px]">↪</span>

            <span className="text-[13px] font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
