export default function Nosotros() {
  return (
    <div className="pt-32 pb-24 container mx-auto px-4 min-h-screen prose prose-slate">
      <h1 className="font-display text-4xl font-bold text-[#654D81] mb-8">Sobre el Proyecto</h1>
      <p className="text-lg md:text-xl text-[#4D4D4D] leading-relaxed font-medium">
         Bioeconomía Bolivia es una iniciativa intersectorial que busca redefinir la relación entre el desarrollo económico y la conservación ambiental.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        <div className="bg-[#EFEAE2] p-8 rounded-3xl border border-outline-variant/30 shadow-md">
          <h3 className="text-[#654D81] font-bold text-xl mb-4">Nuestra Misión</h3>
          <p className="text-[#4D4D4D] text-sm italic leading-relaxed">
            "Sistematizar información de macroregiones estratégicas bolivianas (Amazonía Norte, Manuripi, Madre de Dios, Iténez, Baures y Chiquitanía) para impulsar cadenas de valor sostenibles."
          </p>
        </div>
        <div className="bg-[#EFEAE2] p-8 rounded-3xl border border-outline-variant/30 shadow-md">
          <h3 className="text-[#654D81] font-bold text-xl mb-4">Metodología</h3>
          <p className="text-[#4D4D4D] text-sm leading-relaxed">
            Trabajamos con Sistemas de Información Geográfica (SIG), ciencia de datos y procesos participativos con actores locales y pueblos indígenas.
          </p>
        </div>
      </div>
    </div>
  );
}
