import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Microscope, Map, MapPin } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-[#EBEBEB]">
        <div className="absolute inset-0 z-0 select-none">
          <img
            alt="Bolivian Landscape"
            src="/images/bg_hero.webp"
            className="w-full h-full object-cover opacity-100"
          />
          {/* Capa de sombra/contraste para legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent z-[1]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl bg-transparent"
          >
            <div className="bg-white p-2 md:p-3 w-fit mb-8 mt-24 md:mt-0 rounded-lg">
              <img
                src="/images/icons/ministerio.png"
                alt="Ministerio de Medio Ambiente y Agua"
                className="h-20 md:h-24 object-contain"
              />
            </div>
            <h1 className="font-display text-6xl md:text-7xl font-extrabold text-white mb-8 leading-[1.1] uppercase tracking-tight drop-shadow-2xl">
              ATLAS VIRTUAL DE <span className="text-[#B0946D]">BIOECONOMÍA</span> EN BOLIVIA
            </h1>
            <p className="text-lg md:text-xl text-[#EBEBEB] mb-12 max-w-3xl leading-relaxed font-semibold drop-shadow-2xl">
              La bioeconomía es un modelo de desarrollo que promueve el uso sostenible de los recursos biológicos para generar alimentos, productos y servicios, integrando conocimiento, innovación y tecnología.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/explorador"
                className="font-display bg-[#B0946D] text-white text-3xl px-12 py-5 rounded-2xl font-bold flex items-center gap-3 shadow-2xl hover:bg-[#B0946D]/90 transition-all hover:scale-[1.02] active:scale-95"
              >
                Explorar el Mapa
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bloque de Datos Destacados */}
      <section className="py-16 bg-[#EBEBEB] relative z-20 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#EFEAE2] p-10 rounded-[2.5rem] border border-outline-variant/20 shadow-xl flex flex-col items-center text-center justify-center min-h-[300px]"
            >
              <div className="text-6xl md:text-7xl font-extrabold text-primary mb-4">107</div>
              <div className="text-xl md:text-2xl font-bold text-[#4D4D4D] uppercase tracking-widest">
                Millones de hectáreas rurales
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-primary p-10 rounded-[2.5rem] shadow-xl text-white flex flex-col items-center text-center justify-center min-h-[300px]"
            >
              <div className="text-6xl md:text-7xl font-extrabold mb-4">49%</div>
              <div className="text-xl md:text-2xl font-bold opacity-90 uppercase tracking-widest leading-tight">
                Población pertenece a pueblos indígenas
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bolivia: País megadiverso */}
      <section className="py-24 bg-[#EBEBEB]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-black text-[#654D81] mb-6">Bolivia: País Megadiverso</h2>
            <p className="text-lg md:text-xl text-[#4D4D4D] leading-relaxed font-medium">
              Bolivia se encuentra entre los 15 países con mayor biodiversidad del mundo, albergando una diversidad excepcional de ecosistemas y especies.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6">
            {[
              "Amazonía", "Altiplano", "Valles", "Chaco", "Chiquitanía", "Llanuras y Sabanas", "Yungas"
            ].map((ecosystem, index) => {
              const bgClass = index % 2 === 0 ? "bg-[#397C85]" : "bg-[#B0946D]";
              return (
                <span
                  key={ecosystem}
                  className={`font-display px-8 py-4 text-white font-bold text-lg rounded-2xl uppercase tracking-wide shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${bgClass}`}
                >
                  {ecosystem}
                </span>
              );
            })}
          </div>

          {/* Bloque de Información / Dato Clave (Badge Inferior) */}
          <div className="mt-16 p-6 sm:p-8 bg-[#B0946D]/10 border-l-4 border-[#B0946D] rounded-r-2xl shadow-sm flex flex-col md:flex-row md:items-center gap-6">
            <div className="text-5xl md:text-6xl font-black text-[#B0946D] shrink-0">
              49%
            </div>
            <div className="text-base md:text-lg text-[#4D4D4D] font-medium">
              De la población pertenece a <span className="text-[#397C85] font-black uppercase">pueblos indígenas originarios</span>, custodios históricos de la gran biodiversidad de Bolivia y actores fundamentales para impulsar el desarrollo sostenible a través de la co-creación de saberes y la <span className="text-[#654D81] font-black uppercase">bioeconomía</span>.
            </div>
          </div>
        </div>
      </section>

      {/* Cadenas productivas */}
      <section className="py-24 bg-[#EBEBEB]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-bold text-[#654D81] mb-16 text-center">Cadenas productivas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Tarjeta 1 - Amazonía */}
            <div className="bg-[#EFEAE2] rounded-[2.5rem] border border-outline-variant/30 shadow-2xl flex flex-col group overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img
                  src="/images/card1.webp"
                  alt="Amazonía"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-10 flex-grow border-t border-outline-variant/10">
                <div className="flex items-center gap-2 text-[#654D81] mb-4">
                  <Leaf className="w-6 h-6" />
                  <span className="font-bold uppercase tracking-widest text-xs">Macroregión</span>
                </div>
                <h3 className="font-display text-3xl font-bold text-[#654D81] mb-6">Amazonía</h3>
                <p className="text-[#4D4D4D] mb-8 leading-relaxed">
                  Referente mundial en bioeconomía silvestre. Destaca por el aprovechamiento sostenible de sus recursos forestales y acuáticos.
                </p>
                <ul className="space-y-3 mb-10">
                  {["Frutos amazónicos (Asaí, Castaña)", "Pesca artesanal", "Productos forestales no maderables"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#4D4D4D]">
                      <div className="w-1.5 h-1.5 bg-[#654D81] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/explorador" className="font-display text-primary font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  Ver en el mapa <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Tarjeta 2 - Altiplano */}
            <div className="bg-[#EFEAE2] rounded-[2.5rem] border border-outline-variant/30 shadow-2xl flex flex-col group overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img
                  src="/images/card2.jpg"
                  alt="Altiplano"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-10 flex-grow border-t border-outline-variant/10">
                <div className="flex items-center gap-2 text-primary mb-4">
                  <MapPin className="w-6 h-6" />
                  <span className="font-bold uppercase tracking-widest text-xs">Macroregión</span>
                </div>
                <h3 className="font-display text-3xl font-bold text-[#654D81] mb-6">Altiplano</h3>
                <p className="text-[#4D4D4D] mb-8 leading-relaxed">
                  Cuna de cultivos ancestrales de alto valor nutricional, adaptados a condiciones extremas de altitud.
                </p>
                <ul className="space-y-3 mb-10">
                  {["Quinua Real", "Ganadería de Camélidos", "Cereales Andinos"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#4D4D4D]">
                      <div className="w-1.5 h-1.5 bg-[#B0946D] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/explorador" className="font-display text-primary font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  Ver en el mapa <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Respaldo Institucional */}
      <section className="py-16 md:py-24 bg-surface-container">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-6">Respaldo Institucional</h2>
          <p className="font-sans text-lg md:text-xl text-on-surface-variant leading-relaxed">
            El Atlas Virtual de Bioeconomía en Bolivia es una iniciativa impulsada por el <span className="font-bold text-primary">Ministerio de Medio Ambiente y Agua</span> con el apoyo técnico de la <span className="font-bold text-primary">Organización de las Naciones Unidas para la Alimentación y la Agricultura (FAO)</span>. Esta plataforma consolida la bioeconomía como un motor de desarrollo sostenible, seguridad alimentaria y resiliencia climática en beneficio de las comunidades bolivianas.
          </p>
        </div>
      </section>

      {/* Instituciones y Organizaciones Aliadas */}
      <section className="py-16 bg-surface border-t border-outline-variant/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-primary mb-12 text-center">Instituciones y Organizaciones Aliadas</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="group transition-all">
              <img
                src="/images/icons/ministerio.png"
                alt="Ministerio de Medio Ambiente y Agua"
                className="h-20 md:h-24 object-contain"
              />
            </div>

            <span className="text-on-surface-variant text-base md:text-lg font-medium italic opacity-80">
              con el apoyo técnico de:
            </span>

            <div className="group transition-all">
              <img
                src="/images/icons/fao.png"
                alt="FAO"
                className="h-20 md:h-24 object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
