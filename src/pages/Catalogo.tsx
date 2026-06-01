import {
  ArrowRight,
  Map as MapIcon,
  Info,
  Users,
  TrendingUp,
  ChevronLeft,
  Globe,
  Leaf,
  AlertCircle
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "../lib/utils";

interface Product {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  classification: string;
  coreArea: string;
  macroRegion: string;
  badgeColor: string;
  shortDescription: string;
  status: string;
  img: string;
  ecology: {
    where: string;
    ecosystem: string;
    distribution: string;
  };
  socioeconomics: { label: string; value: string; unit?: string }[];
  valueChain: string[];
  challenges: string[];
  availableLayers: string[];
  exploradorParams: {
    region: string;
    layer: string;
  };
  gallery: { url: string; description: string }[];
}

const products: Product[] = [
  {
    id: "asai",
    name: "Asaí",
    scientificName: "Euterpe precatoria",
    family: "Arecaceae",
    classification: "Fruto Amazónico Silvestre / PFNM",
    coreArea: "Bosques tropicales húmedos de la Amazonía boliviana (24 municipios productores y Territorios Indígenas - TIOCs).",
    macroRegion: "Amazonía",
    badgeColor: "bg-[#397C85]",
    shortDescription: "Fruto amazónico de alto valor nutricional recolectado de forma silvestre bajo modelos de manejo sostenible.",
    status: "Aprovechamiento Sostenible",
    img: "/images/azai/asai1.jpg",
    ecology: {
      where: "Se recolecta en 24 municipios distribuidos en Pando (15), Beni (6), La Paz (2) y Santa Cruz (1).",
      ecosystem: "Bosque tropical húmedo con alta biodiversidad, clave para la regulación climática y captura de carbono.",
      distribution: "Basado en modelos MaxEnt que identifican áreas boscosas óptimas para el aprovechamiento no maderable."
    },
    socioeconomics: [
      { label: "Área de Intervención", value: "216.950", unit: "km²" },
      { label: "Municipios Activos", value: "24", unit: "Entidades" },
      { label: "Participación Femenina", value: "90", unit: "%" },
      { label: "Aprovechamiento", value: "No", unit: "Consuntivo" }
    ],
    valueChain: ["Recolección silvestre", "Centros de acopio locales", "Pulpa congelada", "Asaí liofilizado (polvo)", "Aceites esenciales"],
    challenges: [
      "Logística de transporte de perecederos en zonas remotas.",
      "Impacto de la variabilidad climática en la fenología de la palma.",
      "Presión por deforestación y cambio de uso de suelo en áreas aledañas."
    ],
    availableLayers: [
      "Distribución Potencial (Algoritmo MaxEnt)",
      "Límites Municipales Productores",
      "Comunidades Indígenas y TIOCs"
    ],
    exploradorParams: {
      region: "Amazonía",
      layer: "asai-dist"
    },
    gallery: [
      {
        url: "/images/azai/asai5.jpg",
        description: "Sistema de recolección ancestral en el dosel del bosque amazónico mediante técnicas de escalada segura."
      },
      {
        url: "/images/azai/asai4.jpg",
        description: "Procesamiento local en plantas comunitarias que garantizan la trazabilidad del fruto y el comercio justo."
      }
    ]
  },
  {
    id: "quinua",
    name: "Quinua Real",
    scientificName: "Chenopodium quinoa",
    family: "Amaranthaceae",
    classification: "Grano Andino Ancestral / Denominación de Origen",
    coreArea: "Región intersalárica alrededor de los salares de Uyuni y Coipasa (Altiplano Sur: Oruro y Potosí).",
    macroRegion: "Altiplano",
    badgeColor: "bg-[#654D81]",
    shortDescription: "Grano ancestral andino adaptado a condiciones extremas, reconocido por su calidad superior y Denominación de Origen.",
    status: "Denominación de Origen",
    img: "/images/quinua/quinua5.webp",
    ecology: {
      where: "Altiplano Sur de Bolivia, principalmente en Oruro y Potosí, en las zonas de influencia de los salares de Uyuni y Coipasa.",
      ecosystem: "Ecosistema de alta montaña (>3.600 msnm) con clima frío y semiárido, suelos volcánicos y alta radiación.",
      distribution: "Zonas de cultivo tradicional que operan bajo sistemas de agricultura familiar y rotación de suelos."
    },
    socioeconomics: [
      { label: "Familias Vinculadas", value: "70.000", unit: "+" },
      { label: "Sistemas Comunitarios", value: "120.000", unit: "ha" },
      { label: "Producción Anual", value: "80.000", unit: "TM" },
      { label: "Rango Altitudinal", value: "3.600-4.200", unit: "msnm" }
    ],
    valueChain: ["Agricultura familiar", "Plantas de beneficiado", "Grano perlado", "Harinas y hojuelas", "Productos procesados"],
    challenges: [
      "Degradación acelerada de suelos por mecanización inadecuada.",
      "Variabilidad climática extrema (sequías y heladas recurrentes).",
      "Competencia de precios por producción masiva en otros continentes."
    ],
    availableLayers: [
      "Zonas de Producción SITAP",
      "Sistemas Lacustres y Salares",
      "Ecoregiones del Altiplano Sur"
    ],
    exploradorParams: {
      region: "Altiplano",
      layer: "quinua-prod"
    },
    gallery: [
      {
        url: "/images/quinua/quinua1.png",
        description: "Cultivo resiliente de Quinua Real adaptado a la alta radiación y salinidad de las tierras intersaláricas."
      },
      {
        url: "/images/quinua/quinua4.jpg",
        description: "Sistemas de siembra comunitaria que preservan la biodiversidad genética de las variedades nativas."
      }
    ]
  }
];

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedProductId = searchParams.get("product");
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleOpenExplorer = (params: { region: string; layer: string }) => {
    navigate(`/explorador?region=${params.region}&layer=${params.layer}`);
  };

  if (selectedProduct) {
    return (
      <div className="pt-24 min-h-screen bg-[#EBEBEB]">
        {/* Detail Header - Scientific Focus */}
        <div className="bg-[#EFEAE2] border-b border-outline-variant/10 shadow-sm sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <button
                onClick={() => setSearchParams({})}
                className="p-4 bg-[#B0946D]/10 hover:bg-[#B0946D]/20 rounded-2xl text-[#B0946D] transition-all mt-1"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="font-display text-5xl font-black text-[#654D81] tracking-tighter leading-none">{selectedProduct.name}</h1>
                  <span className={cn("font-display px-4 py-1.5 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg", selectedProduct.badgeColor)}>
                    {selectedProduct.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#4D4D4D]">
                  <p className="font-display text-xl italic font-black opacity-90">{selectedProduct.scientificName}</p>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B0946D]/30" />
                  <p className="text-lg font-bold opacity-80">Familia: {selectedProduct.family}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Visual & Geo-Science */}
            <div className="lg:col-span-12 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                  <div className="aspect-video rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-[#EFEAE2] ring-1 ring-[#654D81]/10">
                    <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Core Abundance Zone */}
                  <div className="bg-[#397C85]/5 rounded-[3rem] p-10 border border-[#397C85]/25">
                    <h3 className="text-xs font-black text-[#397C85] uppercase tracking-[0.2em] mb-4">Zona Núcleo de Abundancia</h3>
                    <p className="text-2xl font-black text-[#4D4D4D] leading-tight tracking-tight">
                      {selectedProduct.coreArea}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  {/* Classification Card */}
                  <div className="bg-[#EFEAE2] rounded-[3rem] p-8 border border-outline-variant/10 shadow-xl">
                    <div className="w-12 h-12 bg-[#397C85]/10 rounded-2xl flex items-center justify-center text-[#397C85] mb-6">
                      <Info className="w-6 h-6" />
                    </div>
                    <h3 className="text-xs font-black text-[#4D4D4D]/60 uppercase tracking-widest mb-2">Clasificación Atlas</h3>
                    <p className="text-lg font-black text-[#4D4D4D] leading-tight">{selectedProduct.classification}</p>
                  </div>

                  {/* Value Chain Quick List */}
                  <div className="bg-[#EFEAE2] rounded-[3rem] p-8 border border-outline-variant/10 shadow-xl">
                    <h3 className="text-xs font-black text-[#654D81] uppercase tracking-widest mb-6 border-b border-[#654D81]/10 pb-4">Cadena de Procesamiento</h3>
                    <div className="space-y-3">
                      {selectedProduct.valueChain.map((step, i) => (
                        <div key={i} className="flex gap-3 text-sm font-bold text-[#4D4D4D]">
                          <span className="text-[#B0946D]/50">/</span> {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Geographic Dashboard (Métricas de Atlas) */}
              <div className="bg-[#EFEAE2] rounded-[4rem] p-12 shadow-2xl border border-outline-variant/5">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#654D81] rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-[#654D81]/20">
                      <Users className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-[#654D81] tracking-tighter">Métricas Territoriales</h2>
                      <p className="text-[#4D4D4D] font-medium opacity-80">Indicadores consolidados de impacto real.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {selectedProduct.socioeconomics.map((stat, i) => (
                    <div key={i} className="bg-[#EBEBEB]/60 p-8 rounded-[2.5rem] border border-outline-variant/10 hover:bg-[#EBEBEB] transition-colors group">
                      <p className="text-[10px] font-black text-[#4D4D4D]/60 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-[#654D81] tracking-tighter group-hover:scale-105 transition-transform origin-left">{stat.value}</span>
                        {stat.unit && <span className="text-lg font-black text-[#397C85] tracking-tight">{stat.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Interconnection Module */}
              <div className="bg-[#397C85] rounded-[4rem] p-12 text-white shadow-3xl shadow-[#397C85]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <MapIcon className="w-64 h-64" />
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-6">Capas activas en la Cartografía</h2>
                    <div className="space-y-4 mb-10">
                      {selectedProduct.availableLayers.map((layer, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                          <div className="w-2 h-2 rounded-full bg-[#654D81] shadow-lg shadow-[#654D81]/50" />
                          <span className="font-bold text-lg">{layer}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleOpenExplorer(selectedProduct.exploradorParams)}
                      className="font-display w-full sm:w-auto bg-[#B0946D] text-white px-10 py-6 rounded-[2rem] font-black shadow-2xl hover:bg-[#654D81] transition-all flex items-center justify-center gap-4 text-lg uppercase tracking-widest"
                    >
                      🗺️ Desplegar Capas en el Explorador Geográfico
                    </button>
                  </div>

                  <div className="hidden lg:block border-l border-white/10 pl-12">
                    <p className="text-xl font-medium text-[#EBEBEB] leading-relaxed mb-8 italic">
                      "La interconexión de capas permite analizar la procedencia biológica en conjunto con las variables sociales, permitiendo una toma de decisiones informada sobre el territorio."
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Globe className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-white/60">Geo-Data Engine v1.2</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenges Section */}
              <div className="bg-[#EFEAE2] rounded-[3rem] p-12 border border-outline-variant/10 shadow-xl">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-12 h-12 bg-[#397C85]/10 rounded-2xl flex items-center justify-center text-[#397C85]">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-black text-[#654D81] tracking-tighter leading-none">Desafíos de la Bioeconomía</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {selectedProduct.challenges.map((challenge, i) => (
                    <div key={i} className="flex gap-5 pt-6 border-t border-outline-variant/10">
                      <span className="text-3xl font-black text-[#654D81]/20">{i + 1}</span>
                      <p className="font-bold text-[#4D4D4D] leading-snug">{challenge}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Educational Gallery */}
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-[#654D81] tracking-tighter">Evidencia Territorial</h2>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#654D81]" />
                    <div className="w-3 h-3 rounded-full bg-[#654D81]/20" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {selectedProduct.gallery.map((img, i) => (
                    <div key={i} className="group flex flex-col gap-6">
                      <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-xl border-4 border-[#EFEAE2] group-hover:shadow-2xl transition-all duration-500">
                        <img src={img.url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <p className="text-xl font-bold text-[#4D4D4D] leading-tight px-4 border-l-4 border-[#654D81]">
                        {img.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#EBEBEB]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-6 h-6 text-[#B0946D] opacity-40" />
              <h1 className="font-display text-6xl font-black text-[#654D81] tracking-tighter">Atlas Bioeconómico</h1>
            </div>
            <p className="text-2xl text-[#4D4D4D] font-medium opacity-80">Repositorio técnico-científico de recursos estratégicos.</p>
          </div>
          <div className="flex gap-2 bg-[#EFEAE2] p-2 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="font-display px-6 py-3 bg-[#B0946D] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#B0946D]/20">Todos</div>
            <div className="font-display px-6 py-3 hover:bg-[#B0946D]/10 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer text-[#4D4D4D]">Amazonía</div>
            <div className="font-display px-6 py-3 hover:bg-[#B0946D]/10 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer text-[#4D4D4D]">Altiplano</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-[#EFEAE2] rounded-[4rem] overflow-hidden shadow-xl border border-outline-variant/10 flex flex-col sm:flex-row h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="sm:w-2/5 relative h-72 sm:h-auto overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                <div className={cn("font-display absolute top-8 left-8 px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.1em]", product.badgeColor)}>
                  {product.macroRegion}
                </div>
              </div>

              <div className="sm:w-3/5 p-12 flex flex-col">
                <div className="mb-6">
                  <h3 className="font-display text-4xl font-black text-[#654D81] leading-tight mb-2 group-hover:text-[#397C85] transition-colors">{product.name}</h3>
                  <p className="font-display text-lg italic text-[#4D4D4D] font-bold opacity-70">{product.scientificName}</p>
                </div>

                <p className="text-[#4D4D4D] leading-relaxed text-base mb-10 flex-grow opacity-90 line-clamp-3">
                  {product.shortDescription}
                </p>

                <button
                  onClick={() => setSearchParams({ product: product.id })}
                  className="font-display w-full flex items-center justify-between bg-[#B0946D]/10 hover:bg-[#B0946D] text-[#B0946D] hover:text-white p-6 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all border border-[#B0946D]/20 shadow-sm"
                >
                  Analizar Ficha Atlas
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Informative Placeholder for other products */}
        <div className="mt-24 p-16 rounded-[5rem] bg-[#EFEAE2] text-center border-4 border-dashed border-[#B0946D]/10 flex flex-col items-center">
          <div className="w-20 h-20 bg-[#654D81]/10 rounded-full flex items-center justify-center mb-8">
            <Info className="w-10 h-10 text-[#654D81] opacity-70" />
          </div>
          <h3 className="text-3xl font-black text-[#654D81] opacity-80 tracking-tight">Expansión de Catalogación Técnica</h3>
          <p className="text-lg text-[#4D4D4D] mt-4 max-w-xl mx-auto leading-relaxed">
            Majo, Castaña, Cacao Silvestre y Vainilla se integrarán próximamente como capas vectoriales y modelos de distribución potencial.
          </p>
        </div>
      </div>
    </div>
  );
}
