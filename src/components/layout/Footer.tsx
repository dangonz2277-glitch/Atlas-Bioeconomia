import { useState } from "react";
import { X } from "lucide-react";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#EBEBEB] border-t border-outline-variant py-12 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start space-y-2 flex-1">
            <div className="font-display text-2xl font-bold text-primary">BIOECONOMÍA BOLIVIA</div>
            <p className="text-sm text-[#4D4D4D] opacity-70 text-center md:text-left">
              © 2026 Plataforma de Bioeconomía de Bolivia. Todos los derechos reservados.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-[#4D4D4D] flex-1">
            <a 
              href="https://bits.bo/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors hover:underline"
            >
              Contacto
            </a>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hover:text-primary transition-colors hover:underline font-semibold"
            >
              Datos Abiertos
            </button>
          </nav>

          <div className="hidden md:block flex-1"></div>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#EFEAE2] rounded-[2rem] shadow-2xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-display text-2xl font-bold text-primary mb-4 pr-8">
              Propiedad Intelectual y Datos
            </h3>
            <p className="text-[#4D4D4D] text-base leading-relaxed mb-8">
              La información geoespacial, polígonos y mapas presentados en esta plataforma son propiedad del Estado Plurinacional de Bolivia y sus respectivos ministerios. Su visualización es de carácter informativo.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-[#B0946D] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#B0946D]/90 transition-transform active:scale-95 shadow-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
