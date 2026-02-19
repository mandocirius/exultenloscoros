"use client";
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <img 
          src="/portada.png" 
          alt="Comunidad de Músicos" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black text-blue-900 uppercase italic tracking-tighter mb-4">
            Nuestra Misión
          </h1>
          <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl md:text-2xl font-serif text-gray-700 leading-relaxed italic">
            "Vayan por todo el mundo y anuncien la Buena Nueva a toda la creación"
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-20 max-w-3xl">
        <div className="space-y-10 text-lg text-gray-600 leading-loose text-justify">
          <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-3 first-letter:float-left">
            Somos una comunidad de músicos católicos al servicio del ministerio al cual Dios nuestro Señor nos llamó. Nuestra pasión es convertir la oración en melodía, permitiendo que la asamblea se eleve en un solo corazón hacia el Padre.
          </p>
          <p>
            Queremos que este proyecto llegue a todos los rincones del orbe, cumpliendo con la misión que Jesús nos dejó: llevar Su palabra a través del canto. Creemos que la música litúrgica no es solo un adorno, sino una parte integral del culto divino que tiene el poder de transformar almas.
          </p>
          <p className="font-bold text-blue-900 italic text-center text-xl py-6 border-y border-blue-50">
            Nuestro ministerio es un puente entre lo humano y lo divino.
          </p>
        </div>

        {/* Contact Buttons */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="https://wa.me/50231793995" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-green-200"
          >
            <span className="text-2xl">💬</span>
            WhatsApp Directo
          </a>
          <a 
            href="mailto:lavr.record@gmail.com"
            className="flex items-center gap-3 bg-gray-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-gray-200"
          >
            <span className="text-2xl">✉️</span>
            Correo Electrónico
          </a>
        </div>
      </section>
    </div>
  );
}
