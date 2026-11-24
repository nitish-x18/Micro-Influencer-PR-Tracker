
import { createContext, useContext, useState } from "react";

const MobileMenuContext = createContext(null);

export function MobileMenuProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <MobileMenuContext.Provider
      value={{ isOpen, openMenu, closeMenu, toggleMenu }}
    >
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);

  if (!context) {
    throw new Error(
      "useMobileMenu must be used inside MobileMenuProvider"
    );
  }

  return context;
}
