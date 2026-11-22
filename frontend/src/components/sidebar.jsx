import {
  CalendarDays,
  LayoutDashboard,
  Package,
  Tag,
  Truck,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/influenceflow-logo.png";

function Sidebar() {
  const navigation = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Brands",
      path: "/brands",
      icon: Tag,
    },
    {
      label: "Products",
      path: "/products",
      icon: Package,
    },
    {
      label: "Shipments",
      path: "/shipments",
      icon: Truck,
    },
    {
      label: "Deadlines",
      path: "/deadlines",
      icon: CalendarDays,
    },
  ];

  return (
    <aside className="hidden min-h-screen w-[250px] shrink-0 bg-[#08263f] lg:flex lg:flex-col">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="flex h-[72px] items-center border-b border-white/10 px-5"
      >
        <div className="flex h-12 w-full items-center rounded-lg bg-white px-3">
          <img
            src={logo}
            alt="InfluenceFlow"
            className="h-10 w-auto object-contain"
          />
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex h-[50px] items-center gap-4 rounded-lg px-4 text-[15px] font-semibold transition ${
                    isActive
                      ? "bg-[#ec6b3c] text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={20} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[10px] text-slate-500">InfluenceFlow · PR Tracker</p>
      </div>
    </aside>
  );
}

export default Sidebar;
