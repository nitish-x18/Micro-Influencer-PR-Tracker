
import GlobalActions from "./GlobalActions";

function Topbar() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7">
      <h1 className="text-xl font-extrabold">Dashboard</h1>

      <div className="flex items-center gap-3 sm:gap-5">
        <GlobalActions />

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
          AM
        </div>
      </div>
    </header>
  );
}

export default Topbar;
