import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/influenceflow-logo.png";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getSession = () => {
    try {
      const savedSession =
        localStorage.getItem("influenceflow_session") ||
        sessionStorage.getItem("influenceflow_session");

      return savedSession ? JSON.parse(savedSession) : null;
    } catch {
      localStorage.removeItem("influenceflow_session");
      sessionStorage.removeItem("influenceflow_session");

      return null;
    }
  };

  const [session, setSession] = useState(getSession);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleDashboard = () => {
    closeMenu();
    navigate("/dashboard");
  };

  const handleGetStarted = () => {
    closeMenu();

    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleSignIn = () => {
    closeMenu();

    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("influenceflow_session");
    sessionStorage.removeItem("influenceflow_session");

    setSession(null);
    closeMenu();

    navigate("/");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        <div className="flex h-[74px] items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center">
            <img
              src={logo}
              alt="InfluenceFlow"
              className="h-12 w-auto object-contain"
            />
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden items-center gap-10 text-[14px] font-medium text-[#18345f] lg:flex">
            <a href="#features" className="transition hover:text-cyan-500">
              Features
            </a>

            <a href="#how-it-works" className="transition hover:text-cyan-500">
              How it works
            </a>

            <a href="#dashboard" className="transition hover:text-cyan-500">
              Dashboard
            </a>

            <a href="#contact" className="transition hover:text-cyan-500">
              Contact
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {session ? (
              <>
                <button
                  type="button"
                  onClick={handleDashboard}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#17345f] transition hover:bg-slate-50"
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e56b3e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85d31]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#17345f] transition hover:bg-slate-50"
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e56b3e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85d31]"
                >
                  Get started
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-[#17345f] transition hover:bg-slate-50 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-slate-100 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              <a
                href="#features"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-[#18345f] hover:bg-slate-50"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-[#18345f] hover:bg-slate-50"
              >
                How it works
              </a>

              <a
                href="#dashboard"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-[#18345f] hover:bg-slate-50"
              >
                Dashboard
              </a>

              <a
                href="#contact"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-[#18345f] hover:bg-slate-50"
              >
                Contact
              </a>

              <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-4">
                {session ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-[#17345f] hover:bg-slate-50"
                    >
                      Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-lg bg-[#e56b3e] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#d85d31]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSignIn}
                      className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-[#17345f] hover:bg-slate-50"
                    >
                      Sign in
                    </button>

                    <button
                      type="button"
                      onClick={handleGetStarted}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e56b3e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d85d31]"
                    >
                      Get started
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
