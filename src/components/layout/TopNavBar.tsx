import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function TopNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Explorador", path: "/explorador" },
    { name: "Catálogo", path: "/catalogo" },
    { name: "Recursos", path: "/recursos" },
    { name: "Quiénes Somos", path: "/nosotros" },
  ];

  return (
    <>
      <header className="bg-primary fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="font-display text-4xl font-bold text-on-primary tracking-tight shrink-0">
              BIOECONOMÍA BOLIVIA
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6 lg:gap-8 items-center ml-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-on-primary transition-opacity font-medium py-1 whitespace-nowrap text-sm lg:text-base",
                    location.pathname === item.path
                      ? "border-b-2 border-on-primary opacity-100"
                      : "opacity-80 hover:opacity-100"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden ml-4">
              <button
                onClick={() => setIsOpen(true)}
                className="text-on-primary p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-[#EFEAE2] z-[70] p-8 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-display font-bold text-primary text-lg">MENÚ</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-primary hover:bg-primary/5 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-2xl font-bold transition-colors",
                      location.pathname === item.path
                        ? "text-primary"
                        : "text-[#4D4D4D] hover:text-primary"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-10 border-t border-outline-variant/30">
                <p className="text-sm text-[#4D4D4D] opacity-60">
                  Atlas de Bioeconomía Bolivia v1.0
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
