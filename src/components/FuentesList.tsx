import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";

interface FuenteRaw {
  "BOSQUEJO GENERAL — ATLAS VIRTUAL DE BIOECONOMÍA EN BOLIVIA": string;
  "": string;
  "__1": string;
  "__2": string;
  "__3": string;
  "__4": string | number;
  "__5": string;
  "__6": string;
  "__7": string;
  "__8": string;
}

export interface Fuente {
  nombre: string;
  institucion: string;
  anio: string;
  geometria: string;
  descripcion: string;
}

export default function FuentesList() {
  const [fuentes, setFuentes] = useState<Fuente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/data/fuentes.json")
      .then(res => res.json())
      .then((data: FuenteRaw[]) => {
        // Ignorar las dos primeras filas (cabeceras del excel)
        const validData = data.slice(2).filter(row => {
            const nombre = row["BOSQUEJO GENERAL — ATLAS VIRTUAL DE BIOECONOMÍA EN BOLIVIA"];
            return nombre && nombre.trim() !== "";
        }).map(row => ({
          nombre: row["BOSQUEJO GENERAL — ATLAS VIRTUAL DE BIOECONOMÍA EN BOLIVIA"],
          geometria: row[""] || "No especificada",
          descripcion: row["__2"] || "Sin descripción",
          institucion: row["__3"] && row["__3"] !== "-" ? row["__3"] : "Institución no especificada",
          anio: row["__4"] && row["__4"] !== "-" ? String(row["__4"]) : "N/A"
        }));
        setFuentes(validData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error cargando fuentes.json", err);
        setIsLoading(false);
      });
  }, []);

  const filteredFuentes = fuentes.filter(f => 
    f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.institucion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full mt-24">
      {/* Encabezado de la Sección */}
      <div className="text-center mb-12">
        <h2 className="font-display text-4xl font-black text-[#654D81] mb-4">Fuentes y Metodología</h2>
        <p className="text-lg text-[#4D4D4D] opacity-80 max-w-2xl mx-auto">
          Explora los metadatos institucionales y el origen de la información cartográfica que respalda el Atlas.
        </p>
      </div>

      {/* Buscador */}
      <div className="relative max-w-xl mx-auto mb-12">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input 
          type="text"
          placeholder="Buscar por nombre de capa o institución..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-outline-variant/20 bg-white focus:outline-none focus:border-[#664e82] focus:ring-4 focus:ring-[#664e82]/10 transition-all shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#664e82]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFuentes.map((fuente, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (index % 10) * 0.05, duration: 0.4 }}
              className="bg-white p-6 md:p-8 rounded-[2rem] border border-outline-variant/10 shadow-md hover:shadow-xl hover:border-b-4 hover:border-[#356854] transition-all duration-300 flex flex-col h-full group"
            >
              <div className="inline-block px-3 py-1 bg-[#397c85]/10 text-[#397c85] text-[10px] font-black uppercase tracking-widest rounded-md w-fit mb-4">
                {fuente.geometria}
              </div>
              <h3 className="text-xl font-bold text-[#654d81] mb-3 leading-tight transition-colors">
                {fuente.nombre}
              </h3>
              <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed">
                {fuente.descripcion}
              </p>
              
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2 mt-auto">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Institución</span>
                  <span className="text-xs text-gray-600 text-right font-medium">{fuente.institucion}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Año Base</span>
                  <span className="text-xs text-gray-600 font-medium bg-gray-50 px-2 py-1 rounded-md">{fuente.anio}</span>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredFuentes.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 font-medium">
              No se encontraron fuentes que coincidan con la búsqueda.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
