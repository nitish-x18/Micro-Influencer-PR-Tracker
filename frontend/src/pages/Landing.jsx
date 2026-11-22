import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
function Landing() {
  const navigate = useNavigate();

  let session = null;

  try {
    const savedSession =
      localStorage.getItem("influenceflow_session") ||
      sessionStorage.getItem("influenceflow_session");

    session = savedSession ? JSON.parse(savedSession) : null;
  } catch {
    localStorage.removeItem("influenceflow_session");
    sessionStorage.removeItem("influenceflow_session");
  }

  const handleGetStarted = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleSignIn = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="bg-white px-5 py-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[4px] bg-[#09263f]">
          <div className="relative min-h-[500px] overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-20 top-0 h-[420px] w-[420px] rounded-full border border-cyan-500/20" />
            <div className="absolute -right-5 top-20 h-[260px] w-[260px] rounded-full border border-cyan-500/20" />

            <div className="relative grid min-h-[500px] items-center gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
              {/* LEFT HERO CONTENT */}
              <div className="relative z-10 max-w-[520px]">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[2px] text-cyan-400">
                  PR PACKAGE TRACKER FOR CREATORS
                </p>

                <h1 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Never lose track of a
                  <br />
                  <span className="text-cyan-400">PR package</span> again.
                </h1>

                <p className="mt-5 max-w-[500px] text-[15px] leading-6 text-slate-300">
                  Keep brands, products, shipments and content deadlines in one
                  calm place, so you always know what has arrived and what is
                  due next.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {session ? (
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="inline-flex items-center gap-2 rounded-md bg-[#e56b3e] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#d85d31]"
                    >
                      Go to dashboard
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleGetStarted}
                        className="inline-flex items-center gap-2 rounded-md bg-[#e56b3e] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#d85d31]"
                      >
                        Get started free
                        <ArrowRight size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={handleSignIn}
                        className="rounded-md border border-slate-500 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <TrustBadge text="Free to start" />
                  <TrustBadge text="Private to your account" />
                  <TrustBadge text="Works on mobile" />
                </div>
              </div>

              {/* DASHBOARD MOCKUP */}
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section id="features" className="bg-white px-5 pb-8 md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Package size={17} />}
            title="Track shipments"
            text="See what is shipped and what has arrived, in one click."
          />

          <FeatureCard
            icon={<CalendarDays size={17} />}
            title="Never miss a deadline"
            text="Content due dates sorted soonest first, overdue clearly flagged."
          />

          <FeatureCard
            icon={<ShoppingBag size={17} />}
            title="Know your value"
            text="Total value of the PR products you are managing."
          />

          <FeatureCard
            icon={<ShieldCheck size={17} />}
            title="Private by design"
            text="Every creator only sees their own records."
          />
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section
        id="how-it-works"
        className="border-t border-slate-200 bg-white px-5 py-7 md:px-8 lg:px-10"
      >
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-8 gap-y-4 sm:justify-center lg:justify-start">
          <Step number="1" text="Add a brand" />
          <Step number="2" text="Add products" />
          <Step number="3" text="Track shipments" />
          <Step number="4" text="Meet deadlines" />
        </div>
      </section>

      {/* =========================================================
    CONTACT
========================================================= */}
      <section
        id="contact"
        className="border-t border-slate-200 bg-[#f7f9fc] px-5 py-12 md:px-8 lg:px-10"
      >
        <div className="mx-auto flex max-w-[1360px] flex-col items-start justify-between gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:px-8 md:py-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-cyan-500">
              Need help?
            </p>

            <h2 className="mt-2 text-xl font-extrabold text-[#12336d]">
              Have a question about InfluenceFlow?
            </h2>

            <p className="mt-2 max-w-[650px] text-sm leading-6 text-slate-500">
              We are here to help you understand the PR tracker and get your
              creator workflow organized.
            </p>
          </div>

          <a
            href="mailto:support@influenceflow.in"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#e56b3e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85d31]"
          >
            Contact support
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* =========================================================
   DASHBOARD PREVIEW
========================================================= */

function DashboardPreview() {
  return (
    <div id="dashboard" className="relative z-10 mx-auto w-full max-w-[650px]">
      {/* Browser */}
      <div className="overflow-hidden rounded-xl border border-slate-300/50 bg-white shadow-2xl">
        {/* Browser top */}
        <div className="flex h-8 items-center gap-2 border-b border-slate-200 bg-slate-100 px-3">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />

          <div className="ml-3 h-4 flex-1 rounded-full bg-white px-3 text-[7px] leading-4 text-slate-400">
            app.influenceflow.in/dashboard
          </div>
        </div>

        {/* App */}
        <div className="flex min-h-[315px]">
          {/* Sidebar */}
          <aside className="hidden w-[145px] shrink-0 bg-[#102a43] p-3 sm:block">
            <div className="mb-6 rounded-md bg-white px-2 py-2">
              <div className="text-[12px] font-extrabold text-[#173b72]">
                influence<span className="text-cyan-500">flow</span>
              </div>

              <div className="text-[5px] font-bold tracking-[2px] text-slate-500">
                PR TRACKER
              </div>
            </div>

            <div className="space-y-1 text-[10px] text-slate-300">
              <SidebarItem active icon="▦" text="Dashboard" />
              <SidebarItem icon="◇" text="Brands" />
              <SidebarItem icon="▱" text="Products" />
              <SidebarItem icon="□" text="Shipments" />
              <SidebarItem icon="▣" text="Deadlines" />
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Dashboard</h3>

              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-[7px] font-bold text-white">
                AM
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <StatCard
                label="Active shipments"
                value="12"
                icon={<Package size={11} />}
              />

              <StatCard
                label="Upcoming"
                value="6"
                icon={<Clock3 size={11} />}
              />

              <StatCard label="Overdue" value="2" icon={<Clock3 size={11} />} />
            </div>

            {/* Deadlines */}
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
              <div className="mb-3 text-[10px] font-bold text-slate-800">
                Upcoming deadlines
              </div>

              <Deadline
                date="12"
                month="OCT"
                title="Wireless Earbuds review"
                platform="Instagram"
                status="Overdue"
                overdue
              />

              <Deadline
                date="15"
                month="OCT"
                title="Skincare Kit unboxing"
                platform="YouTube"
                status="Upcoming"
              />

              <Deadline
                date="18"
                month="OCT"
                title="Travel Mug story set"
                platform="Pinterest"
                status="Upcoming"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <div className="absolute -bottom-4 left-0 hidden rounded-lg border border-slate-200 bg-white px-4 py-3 text-[9px] shadow-xl sm:block">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Clock3 size={12} />3 deadlines this week
        </div>

        <div className="mt-1 text-slate-400">Next: Skincare Kit, 15 Oct.</div>
      </div>

      {/* Shipment notification */}
      <div className="absolute -bottom-4 right-0 hidden rounded-lg border border-slate-200 bg-white px-4 py-3 text-[9px] shadow-xl sm:block">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Check size={12} className="text-green-500" />
          Shipment received
        </div>

        <div className="mt-1 text-slate-400">
          SHP-001 is now in your inventory.
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function TrustBadge({ text }) {
  return (
    <span className="rounded-full border border-slate-500/60 bg-white/5 px-3 py-1.5 text-[9px] font-medium text-slate-300">
      {text}
    </span>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="min-h-[125px] rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
        {icon}
      </div>

      <h3 className="mt-3 text-[13px] font-bold text-[#12336d]">{title}</h3>

      <p className="mt-1 text-[11px] leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">
        {number}
      </div>

      <span className="text-xs font-semibold text-slate-700">{text}</span>
    </div>
  );
}

function SidebarItem({ icon, text, active }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md px-2 py-2 ${
        active ? "bg-[#e56b3e] text-white" : "text-slate-300"
      }`}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-2.5">
      <div className="flex items-center gap-1 text-[7px] text-slate-400">
        {icon}
        {label}
      </div>

      <div className="mt-1 text-lg font-extrabold text-slate-800">{value}</div>
    </div>
  );
}

function Deadline({ date, month, title, platform, status, overdue }) {
  return (
    <div className="mb-2 flex items-center gap-2 rounded-md border border-slate-100 p-2 last:mb-0">
      <div className="w-8 text-center">
        <div className="text-sm font-bold text-slate-800">{date}</div>
        <div className="text-[6px] text-slate-400">{month}</div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[8px] font-semibold text-slate-700">
          {title}
        </div>

        <div className="mt-0.5 text-[7px] text-slate-400">{platform}</div>
      </div>

      <span
        className={`rounded-full px-2 py-1 text-[6px] font-semibold ${
          overdue ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

export default Landing;
