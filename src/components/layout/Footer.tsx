import { Link } from "react-router-dom";
import { Share2, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#EBEBEB] border-t border-outline-variant py-12 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="font-display text-2xl font-bold text-primary">BIOECONOMÍA BOLIVIA</div>
          <p className="text-sm text-[#4D4D4D] opacity-70">
            © 2026 Plataforma de Bioeconomía de Bolivia. Todos los derechos reservados.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-[#4D4D4D]">
          <Link to="#" className="hover:text-primary transition-colors hover:underline">Política de Privacidad</Link>
          <Link to="#" className="hover:text-primary transition-colors hover:underline">Términos de Uso</Link>
          <Link to="#" className="hover:text-primary transition-colors hover:underline">Contacto</Link>
          <Link to="#" className="hover:text-primary transition-colors hover:underline">Datos Abiertos</Link>
        </nav>

        <div className="flex gap-4">
          <button className="p-3 border border-outline-variant rounded-full text-[#4D4D4D] hover:bg-primary/5 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 border border-outline-variant rounded-full text-[#4D4D4D] hover:bg-primary/5 transition-colors">
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
