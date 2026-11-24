
import {
  CalendarDays,
  LayoutDashboard,
  Package,
  Tag,
  Truck,
  X,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/influenceflow-logo.png";
import { useMobileMenu } from "./MobileMenuContext";

function Sidebar() {
  const { isOpen, closeMenu } = useMobileMenu();

  const navigation = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Brands", path: "/brands", icon: Tag },
    { label: "Products", path: "/products", icon: Package },
    { label: "Shipments", path: "/shipments", icon: Truck },
    { label: "Deadlines", path: "/deadlines", icon: CalendarDays },
  ];

  const renderLogo = () => (
    <Link
      to="/dashboard"
      onClick={closeMenu}
      className="flex h-[72px] items-center border-b border-white/10 px-5"
    >
      <div className="flex h-12 w-full items-center rounded-lg bg-white px-3">
        <img src={logo} alt="InfluenceFlow" className="h-10 w-auto object-contain" />
      </div>
    </Link>
  );

  const renderNavigation = () => (
    <nav className="flex-1 px-2 py-6">
      <div className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
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
  );

  const renderFooter = () => (
    <div className="border-t border-white/10 px-5 py-4">
      <p className="text-[10px] text-slate-500">InfluenceFlow · PR Tracker</p>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden min-h-screen w-[250px] shrink-0 bg-[#08263f] lg:flex lg:flex-col">
        {renderLogo()}
        {renderNavigation()}
        {renderFooter()}
      </aside>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "visible" : "invisible"}`}>
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute left-0 top-0 flex h-full w-[280px] max-w-[85vw] flex-col bg-[#08263f] shadow-xl transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center">
            <div className="flex-1">{renderLogo()}</div>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"
            >
              <X size={22} />
            </button>
          </div>

          {renderNavigation()}
          {renderFooter()}
        </aside>
      </div>
    </>
  );
}

export default Sidebar;
