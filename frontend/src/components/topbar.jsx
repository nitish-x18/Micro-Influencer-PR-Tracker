import { Bell, Search } from "lucide-react";

function Topbar() {
  const session = JSON.parse(
    localStorage.getItem("influenceflow_session")
  );

  const initials =
    session?.fullName
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AM";

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-7">
      {/* Dashboard title */}
      <div className="flex items-center">
        <h2 className="text-[21px] font-extrabold text-slate-900">
          Dashboard
        </h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
          aria-label="Search"
        >
          <Search size={21} strokeWidth={1.8} />
        </button>

        {/* Notification */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={21} strokeWidth={1.8} />

          <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-[#e56b3e]" />
        </button>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}

export default Topbar;