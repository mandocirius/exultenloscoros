"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface Experience {
  id: string;
  name: string;
  rating: number;
  comment: string;
  recommendation: string;
  date: any;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [formData, setFormData] = useState({ rating: 5, comment: '', recommendation: '' });
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Escuchar testimonios en tiempo real desde Firestore
  useEffect(() => {
    const q = query(collection(db, "experiences"), orderBy("date", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Experience[];
      setExperiences(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmitExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Inicia sesión para compartir tu experiencia.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "experiences"), {
        name: user.displayName || user.email?.split('@')[0] || "Hermano",
        rating: formData.rating,
        comment: formData.comment,
        recommendation: formData.recommendation,
        userId: user.uid,
        date: serverTimestamp()
      });
      setFormData({ rating: 5, comment: '', recommendation: '' });
      alert("¡Gracias por tu testimonio! Se ha publicado en la comunidad.");
    } catch (error: any) {
      alert("Error al enviar: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    try {
      await addDoc(collection(db, "subscribers"), {
        email: contactEmail,
        date: serverTimestamp()
      });
      alert("¡Bienvenido a la Asamblea Digital!");
      setContactEmail('');
    } catch (error) {
      alert("Hubo un error al suscribirte.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < count ? "text-yellow-400" : "text-gray-200"}>★</span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <img src="/portada.png" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">
            Vuestra Experiencia
          </h1>
          <p className="text-xl md:text-2xl font-serif text-blue-100 italic opacity-90">
            "Cantad al Señor un cántico nuevo, resuene su alabanza en la asamblea de los fieles"
          </p>
        </div>
      </section>

      {/* Feed de Testimonios */}
      <section className="container mx-auto px-6 py-16 max-w-5xl">
        <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase mb-12 flex items-center gap-4">
          <span className="w-12 h-[1px] bg-gray-200"></span>
          Voces de la Comunidad ({experiences.length})
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <div key={exp.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Testimonio Reales</span>
                    <h3 className="font-bold text-gray-900 text-lg">{exp.name}</h3>
                  </div>
                  <div className="text-xl flex">{renderStars(exp.rating)}</div>
                </div>
                <p className="text-gray-600 leading-relaxed italic mb-6 flex-grow">"{exp.comment}"</p>
                {exp.recommendation && (
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                    <p className="text-[9px] font-black text-amber-800 uppercase mb-1 tracking-wider">Sugerencia de mejora:</p>
                    <p className="text-sm text-amber-700 font-medium">{exp.recommendation}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-serif italic text-xl">Cargando experiencias de los hermanos...</p>
            </div>
          )}
        </div>
      </section>

      {/* Formulario de Experiencia (Solo Logueados) */}
      <section className="bg-gray-50 py-24 px-6 border-y">
        <div className="container mx-auto max-w-2xl bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Danos tu Valoración</h2>
            <p className="text-gray-500 font-serif italic text-lg">¿Cómo te ha servido este cancionero?</p>
          </div>

          {!user ? (
            <div className="text-center py-10 bg-blue-50 rounded-3xl border border-dashed border-blue-200">
              <p className="text-blue-800 mb-4 font-bold">Inicia sesión para dejar tu valoración</p>
              <button onClick={() => window.location.href='/login'} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Ir al Inicio de Sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitExperience} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Tu Puntuación</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: num })}
                      className={`text-3xl transition-all ${formData.rating >= num ? 'scale-125 grayscale-0' : 'grayscale opacity-30 scale-100'}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Tu Comentario</label>
                <textarea
                  required
                  placeholder="Ej: Me ayuda mucho en mi coro parroquial..."
                  className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all text-sm h-32"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">¿Qué podemos mejorar?</label>
                <textarea
                  placeholder="Nuevas funciones, cantos específicos..."
                  className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all text-sm h-32"
                  value={formData.recommendation}
                  onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-xs py-5 rounded-[2rem] transition-all shadow-xl shadow-gray-200 hover:shadow-blue-200 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Publicar Testimonio'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Formulario de Suscripción (PARA TODOS) */}
      <section className="bg-gray-900 py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
              Únete a la Asamblea Digital
            </h2>
            <p className="text-blue-200 text-lg">
              Recibe novedades y recursos directamente en tu correo electrónico.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="bg-white/5 backdrop-blur-md p-1 rounded-[3rem] shadow-2xl border border-white/10 max-w-2xl mx-auto flex flex-col md:flex-row">
            <input
              type="email"
              required
              placeholder="Escribe tu correo electrónico aquí"
              className="bg-transparent text-white px-8 py-5 focus:outline-none placeholder:text-gray-500 flex-grow"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-5 px-10 rounded-[2.8rem] transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubscribing ? 'Guardando...' : 'Contactarme'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
