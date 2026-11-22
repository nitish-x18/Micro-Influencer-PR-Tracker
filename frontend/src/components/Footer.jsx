function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#f7f9fb]">
      <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-3 px-6 py-4 text-xs text-slate-500 sm:flex-row md:px-8 lg:px-10">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-[7px] font-bold text-white">
            IF
          </div>

          <span>InfluenceFlow · PR Tracker</span>
        </div>

        {/* Footer Links */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="transition hover:text-slate-800"
            onClick={() =>
              alert("Privacy Policy will be available soon.")
            }
          >
            Privacy
          </button>

          <span>·</span>

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