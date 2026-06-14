import { useState } from "react";
import { X, Map, Layers, ZoomIn, MousePointerClick } from "lucide-react";

export default function Footer() {
  const [activeModal, setActiveModal] = useState<"guia" | "datos" | null>(null);

  return (
    <>
      <footer className="bg-[#EBEBEB] border-t border-outline-variant py-8 px-4 shadow-sm text-[#4D4D4D]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-sm">
          {/* Lado Izquierdo */}
          <div className="flex flex-col items-center md:items-start opacity-80">
            <span className="font-semibold text-primary mb-1">BIOECONOMÍA BOLIVIA</span>
            <span>© 2026 Plataforma de Bioeconomía de Bolivia.</span>
            <span className="text-xs mt-0.5">v1.0.0</span>
          </div>

          {/* Centro */}
          <nav className="flex flex-wrap justify-center gap-6 font-semibold">
            <button 
              onClick={() => setActiveModal("guia")}
              className="hover:text-primary transition-colors hover:underline"
            >
              Guía de Uso
            </button>
            <button 
              onClick={() => setActiveModal("datos")}
              className="hover:text-primary transition-colors hover:underline"
            >
              Datos Abiertos
            </button>
            <a 
              href="https://bits.bo/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors hover:underline"
            >
              Contacto
            </a>
          </nav>

          {/* Lado Derecho */}
          <div className="flex justify-center md:justify-end opacity-80 font-medium">
            Desarrollado por BITS
          </div>
        </div>
      </footer>

      {/* Modal Guía de Uso */}
      {activeModal === "guia" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#EFEAE2] rounded-[2rem] shadow-2xl max-w-2xl w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-display text-3xl font-bold text-primary mb-8 pr-8 text-center md:text-left">
              Guía Rápida del Atlas
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#B0946D]/20 p-3 rounded-xl shrink-0">
                  <Map className="w-6 h-6 text-[#B0946D]" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-lg">1. Explora por Macrorregiones</h4>
                  <p className="text-[#4D4D4D] leading-relaxed">Navega por las distintas regiones del país para centrar automáticamente el mapa en áreas de interés como la Amazonía o el Altiplano.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-lg">2. Activa las Capas Temáticas</h4>
                  <p className="text-[#4D4D4D] leading-relaxed">Usa el panel interactivo para encender o apagar capas de información: áreas protegidas, cuencas hidrográficas o sistemas productivos.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#397C85]/20 p-3 rounded-xl shrink-0">
                  <ZoomIn className="w-6 h-6 text-[#397C85]" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-lg">3. Analiza las Agrupaciones</h4>
                  <p className="text-[#4D4D4D] leading-relaxed">Los puntos muy cercanos se agrupan en círculos numéricos para no saturar la vista. Haz clic en ellos o acerca el mapa (zoom) para separarlos y verlos individualmente.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#6E0792]/10 p-3 rounded-xl shrink-0">
                  <MousePointerClick className="w-6 h-6 text-[#6E0792]" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-lg">4. Descubre Datos Específicos</h4>
                  <p className="text-[#4D4D4D] leading-relaxed">Selecciona cualquier polígono, punto o marcador directamente sobre el mapa para visualizar sus estadísticas e información detallada.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-transform active:scale-95 shadow-md w-full md:w-auto"
              >
                ¡Entendido, a explorar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Datos Abiertos */}
      {activeModal === "datos" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#EFEAE2] rounded-[2rem] shadow-2xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setActiveModal(null)}
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
                onClick={() => setActiveModal(null)}
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
