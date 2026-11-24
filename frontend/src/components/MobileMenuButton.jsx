
import { Menu } from "lucide-react";
import { useMobileMenu } from "./MobileMenuContext";

function MobileMenuButton() {
  const { toggleMenu } = useMobileMenu();

  return (
    <button
      type="button"
      onClick={toggleMenu}
      aria-label="Open navigation menu"
      className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:hidden"
    >
      <Menu size={24} />
    </button>
  );
}

export default MobileMenuButton;
