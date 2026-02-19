"use client";
import { useState } from 'react';

export default function CommunityPage() {
  const [formData, setFormData] = useState({ name: '', email: '', ministry: '' });
  const [submitted, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simular guardado
    setTimeout(() => {
      alert("¡Gracias por unirte a nuestra comunidad!");
      setFormData({ name: '', email: '', ministry: '' });
      setSubmitting(false);
    }, 1000);
  };

  const blogPosts = [
    {
      title: "El poder del Salmo en la Liturgia",
      excerpt: "Cómo elegir la melodía adecuada para que el salmo resuene en el alma de los fieles...",
      date: "15 Feb, 2026",
      tag: "Formación"
    },
    {
      title: "Nuevos Cantos para Cuaresma",
      excerpt: "Explora nuestra última colección de partituras seleccionadas para este tiempo de conversión...",
      date: "10 Feb, 2026",
      tag: "Novedades"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Blog Section */}
      <section className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-12 flex items-center gap-4">
          <span className="w-12 h-1 bg-blue-600"></span>
          Blog & Formación
        </h1>
        
        <div className="grid md:grid-cols-2 gap-10">
          {blogPosts.map((post, i) => (
            <article key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer">
              <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase bg-blue-50 px-4 py-1.5 rounded-full">
                {post.tag}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                <span>{post.date}</span>
                <span className="text-blue-600 group-hover:translate-x-2 transition-transform">Leer más →</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Subscription Form */}
      <section className="bg-gray-900 py-24 px-6 mt-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
              Únete a la Asamblea Digital
            </h2>
            <p className="text-blue-200 text-lg">
              Recibe partituras exclusivas, tutoriales y reflexiones en tu correo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md p-1 rounded-[3rem] shadow-2xl border border-white/10">
            <div className="grid md:grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="Tu Nombre"
                className="bg-transparent text-white px-8 py-5 focus:outline-none placeholder:text-gray-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input
                type="email"
                required
                placeholder="Tu Correo"
                className="bg-transparent text-white px-8 py-5 focus:outline-none border-y md:border-y-0 md:border-x border-white/10 placeholder:text-gray-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <button
                type="submit"
                disabled={submitted}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-5 px-8 rounded-[2.8rem] transition-all active:scale-95 disabled:opacity-50"
              >
                {submitted ? 'Procesando...' : 'Subscribirse'}
              </button>
            </div>
          </form>
          
          <p className="text-center text-gray-500 text-xs mt-8">
            Al suscribirte, aceptas recibir contenido de nuestro ministerio. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </section>
    </div>
  );
}
