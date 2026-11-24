
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
    navigate(session ? "/dashboard" : "/register");
  };

  const handleSignIn = () => {
    closeMenu();
    navigate(session ? "/dashboard" : "/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("influenceflow_session");
    sessionStorage.removeItem("influenceflow_session");
    localStorage.removeItem("influenceflow_token");
    sessionStorage.removeItem("influenceflow_token");

    setSession(null);
    closeMenu();
    navigate("/", { replace: true });
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <nav className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-[68px] w-full min-w-0 items-center justify-between gap-3 sm:min-h-[74px]">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex min-w-0 shrink items-center"
          >
            <img
              src={logo}
              alt="InfluenceFlow"
              className="h-10 w-auto max-w-full shrink-0 object-contain sm:h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 text-sm font-medium text-[#18345f] lg:flex xl:gap-10">
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
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {session ? (
              <>
                <button
                  type="button"
                  onClick={handleDashboard}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#17345f] transition hover:bg-slate-50"
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e56b3e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d85d31]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#17345f] transition hover:bg-slate-50"
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e56b3e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d85d31]"
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-[#17345f] transition hover:bg-slate-50 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="w-full border-t border-slate-100 py-4 lg:hidden"
          >
            <div className="flex w-full flex-col gap-1">
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

              <div className="mt-3 flex w-full flex-col gap-2 border-t border-slate-100 pt-4">
                {session ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-[#17345f] hover:bg-slate-50"
                    >
                      Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg bg-[#e56b3e] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#d85d31]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSignIn}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-[#17345f] hover:bg-slate-50"
                    >
                      Sign in
                    </button>

                    <button
                      type="button"
                      onClick={handleGetStarted}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e56b3e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d85d31]"
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
