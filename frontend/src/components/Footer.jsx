
function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-[#f7f9fb]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 md:px-8 lg:px-10">

        {/* Brand */}
        <div className="flex min-w-0 flex-wrap items-center justify-center gap-2 sm:justify-start">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-[7px] font-bold text-white">
            IF
          </div>

          <span className="text-center">
            InfluenceFlow · PR Tracker
          </span>
        </div>

        {/* Footer Links */}
        <div className="flex shrink-0 items-center justify-center gap-3">
          <button
            type="button"
            className="transition hover:text-slate-800"
            onClick={() =>
              alert("Privacy Policy will be available soon.")
            }
          >
            Privacy
          </button>

          <span aria-hidden="true">·</span>

          <button
            type="button"
            className="transition hover:text-slate-800"
            onClick={() =>
              alert("Terms of Service will be available soon.")
            }
          >
            Terms
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
