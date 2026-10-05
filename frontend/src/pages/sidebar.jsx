import React from "react";
import { NavLink, Link } from "react-router-dom";
import sidebarLogo from "../assets/mipt-sidebar-logo.png";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          width="24"
          height="24"
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
          width="24"
          height="24"
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
          width="24"
          height="24"
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
          width="24"
          height="24"
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
          width="24"
          height="24"
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
    <aside className="fixed left-0 top-0 z-40 w-[243px] h-screen bg-[#0a1d2e] text-white flex flex-col">

      {/* LOGO */}
      <div className="h-[92px] flex items-center justify-center px-4">
        <img
          src={sidebarLogo}
          alt="MIPT PR Package Tracker"
          className="w-[205px] h-auto object-contain"
        />
      </div>

      {/* MENU */}
      <nav className="px-3 flex-1">
        <div className="space-y-1">

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `h-[64px] px-5 rounded-[8px] flex items-center gap-4 transition ${
                  isActive
                    ? "bg-[#ff641c] text-white"
                    : "text-[#d7e0e8] hover:bg-[#132b40] hover:text-white"
                }`
              }
            >
              <span className="flex items-center justify-center">
                {item.icon}
              </span>

              <span className="text-[17px] font-semibold">
                {item.name}
              </span>
            </NavLink>
          ))}

        </div>
      </nav>

      {/* BOTTOM USER AREA */}
      <div className="px-5 pb-6">

        <div className="border-t border-[#294054] mb-5"></div>

        <Link
          to="/profile"
          className="flex items-center gap-3 no-underline"
        >
          <div className="w-[48px] h-[48px] rounded-full bg-[#f2f2f2] text-[#17324d] flex items-center justify-center text-[16px] font-medium">
            JD
          </div>

          <div>
            <div className="text-white text-[15px] font-semibold">
              Jane Doe
            </div>

            <div className="text-[#b8c5d1] text-[13px] mt-1">
              jane@example.com
            </div>
          </div>
        </Link>

      </div>

    </aside>
  );
}

export default Sidebar;