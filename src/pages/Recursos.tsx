import { 
  Map as MapIcon, 
  Download, 
  FileText,
  BookOpen,
  MapPin,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";

interface Resource {
  id: string;
  title: string;
  description: string;
  typeBadge: "Mapa para el explorador" | "Documento de lectura (PDF)";
  tag: string;
  category: "Amazonía" | "Altiplano" | "Guía";
  exploradorParams?: {
    region: string;
    layer: string;
  };
}

const resources: Resource[] = [
  {
    id: "mapa-asai",
    title: "Mapa del Asaí en la Amazonía",
    description: "Descubre las zonas donde se recolecta el asaí y las comunidades que trabajan en la selva protegiendo el bosque.",
    typeBadge: "Mapa para el explorador",
    tag: "Mapa Interactivo",
    category: "Amazonía",
    exploradorParams: { region: "Amazonía", layer: "asai-dist" }
  },
  {
    id: "mapa-quinua",
    title: "Mapa de la Quinua en el Altiplano",
    description: "Explora las áreas de cultivo de la Quinua Real en Oruro y Potosí y su cercanía con los grandes salares.",
    typeBadge: "Mapa para el explorador",
    tag: "Mapa Interactivo",
    category: "Altiplano",
    exploradorParams: { region: "Altiplano", layer: "quinua-prod" }
  },
  {
    id: "guia-bioeconomia",
    title: "Guía de Bioeconomía en Bolivia",
    description: "Una introducción sencilla para entender cómo podemos cuidar la naturaleza mientras generamos desarrollo.",
    typeBadge: "Documento de lectura (PDF)",
    tag: "Lectura Educativa",
    category: "Guía"
  },
  {
    id: "comunidades-indigenas",
    title: "Territorios Indígenas y el Bosque",
    description: "Conoce los pueblos que cuidan nuestra Amazonía y sus formas tradicionales de aprovechar los frutos.",
    typeBadge: "Mapa para el explorador",
    tag: "Social y Cultura",
    category: "Amazonía",
    exploradorParams: { region: "Amazonía", layer: "tiocs-amazon" }
  }
];

export default function Recursos() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredResources = resources.filter((r) => {
    if (activeFilter === "Todos") return true;
    if (activeFilter === "Guías en PDF") return r.category === "Guía";
    return r.category === activeFilter;
  });

  const handleVisualize = (params: { region: string; layer: string }) => {
    navigate(`/explorador?region=${params.region}&layer=${params.layer}`);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#EBEBEB] text-[#4D4D4D]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-display text-5xl md:text-6xl font-black text-[#654D81] tracking-tighter leading-tight">
            Biblioteca del Atlas: <span className="text-[#397C85]">Mapas y Documentos</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#4D4D4D] font-medium opacity-70 max-w-2xl mx-auto">
            Descarga o explora los materiales visuales de la bioeconomía en Bolivia de forma sencilla.
          </p>
        </div>

        {/* Simplified Filters (Pills) */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {["Todos", "Amazonía", "Altiplano", "Guías en PDF"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "font-display px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all shadow-sm border-2",
                activeFilter === filter 
                  ? "bg-[#B0946D] border-[#B0946D] text-white shadow-xl shadow-[#B0946D]/20 scale-105" 
                  : "bg-[#EFEAE2] border-outline-variant/10 text-[#4D4D4D] hover:border-[#B0946D]/30"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {filteredResources.map((resource) => (
            <div 
              key={resource.id} 
              className="bg-[#EFEAE2] rounded-[3.5rem] p-10 md:p-12 border border-outline-variant/10 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-full group"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 bg-[#B0946D]/10 rounded-[2rem] flex items-center justify-center text-[#B0946D] group-hover:bg-[#B0946D] group-hover:text-white transition-colors duration-500">
                  {resource.typeBadge.includes("Mapa") ? <MapIcon className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
                </div>
                <span className="font-display px-5 py-2 bg-[#654D81]/10 text-[#654D81] rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-[#654D81]/10">
                  {resource.tag}
                </span>
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-3">
                   <div className="font-display px-3 py-1 bg-[#654D81]/10 rounded-lg text-[10px] font-black text-[#654D81] uppercase tracking-widest">
                    {resource.typeBadge}
                   </div>
                </div>
                <h3 className="font-display text-3xl font-black text-[#654D81] leading-tight tracking-tight mb-4 group-hover:translate-x-1 transition-transform">
                  {resource.title}
                </h3>
                <p className="text-lg text-[#4D4D4D] leading-relaxed opacity-80 mb-10">
                  {resource.description}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {resource.exploradorParams && (
                  <button 
                    onClick={() => handleVisualize(resource.exploradorParams!)}
                    className="font-display w-full flex items-center justify-center gap-4 bg-[#B0946D] text-white p-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-[#B0946D]/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <MapIcon className="w-5 h-5 text-white" />
                    Ver en el Mapa
                  </button>
                )}
                <button 
                  onClick={() => alert("La descarga comenzará pronto (Contenido de ejemplo)")}
                  className={cn(
                    "font-display w-full flex items-center justify-center gap-4 p-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all border-2",
                    resource.exploradorParams 
                      ? "border-outline-variant/10 text-[#4D4D4D] hover:bg-[#EBEBEB]" 
                      : "bg-[#B0946D] text-white shadow-xl shadow-[#B0946D]/20 hover:scale-[1.02] active:scale-95 border-[#B0946D]"
                  )}
                >
                  <Download className="w-5 h-5 opacity-40" />
                  Descargar Material
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Friendly Footer */}
        <div className="mt-24 p-12 md:p-16 rounded-[4rem] bg-[#B0946D]/5 border-2 border-dashed border-[#B0946D]/30 flex flex-col items-center text-center">
           <MapPin className="w-12 h-12 text-[#B0946D] opacity-40 mb-6" />
           <h4 className="text-2xl font-black text-[#B0946D] tracking-tighter mb-4">¿Buscas algo más?</h4>
           <p className="text-lg text-[#4D4D4D] opacity-80 mb-10 max-w-xl">
             Estamos añadiendo nuevos mapas y guías educativas cada mes para que todos podamos conocer mejor nuestra biodiversidad.
           </p>
           <button className="font-display flex items-center gap-4 text-[#B0946D] font-black uppercase tracking-[0.2em] text-xs hover:gap-6 transition-all">
             Contactar con el equipo técnico <ChevronRight className="w-5 h-5 text-[#654D81]" />
           </button>
        </div>
      </div>
    </div>
  );
}

