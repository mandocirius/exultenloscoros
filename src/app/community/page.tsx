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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar experiencias de Firestore
  useEffect(() => {
    const q = query(collection(db, "experiences"), orderBy("date", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Experience[];
      setExperiences(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Por favor, inicia sesión para compartir tu experiencia.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "experiences"), {
        name: user.displayName || user.email?.split('@')[0] || "Hermano en Cristo",
        rating: formData.rating,
        comment: formData.comment,
        recommendation: formData.recommendation,
        userId: user.uid,
        date: serverTimestamp()
      });
      setFormData({ rating: 5, comment: '', recommendation: '' });
      alert("¡Gracias por tu testimonio!");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al enviar tu comentario. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (count: number) => {
    return "⭐".repeat(count);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">
            Vuestra Experiencia
          </h1>
          <p className="text-xl md:text-2xl font-serif text-blue-100 italic opacity-90">
            "Donde dos o tres se reúnen en mi nombre, allí estoy yo en medio de ellos"
          </p>
        </div>
      </section>

      {/* Feed de Testimonios */}
      <section className="container mx-auto px-6 py-16 max-w-5xl">
        <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase mb-12 flex items-center gap-4">
          <span className="w-12 h-[1px] bg-gray-200"></span>
          Testimonios de la Comunidad
        </h2>

        <div className="grid gap-8">
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <div key={exp.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">{exp.name}</h3>
                    <div className="text-yellow-400 text-sm mt-1">{renderStars(exp.rating)}</div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 uppercase italic">Experiencia</span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{exp.comment}"</p>
                {exp.recommendation && (
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-50">
                    <p className="text-xs font-bold text-blue-800 uppercase mb-1 tracking-wider">Recomendación para el sitio:</p>
                    <p className="text-sm text-blue-600 italic">{exp.recommendation}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-10 italic font-serif">Aún no hay testimonios. ¡Sé el primero en compartir!</p>
          )}
        </div>
      </section>

      {/* Formulario de Participación */}
      <section className="bg-gray-50 py-24 px-6 border-t">
        <div className="container mx-auto max-w-2xl bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Comparte y Mejora</h2>
            <p className="text-gray-500 font-serif italic text-lg">Tu opinión nos ayuda a servir mejor al Señor</p>
          </div>

          {!user ? (
            <div className="text-center py-10 bg-blue-50 rounded-3xl border border-dashed border-blue-200">
              <p className="text-blue-800 mb-4 font-bold">Inicia sesión para dejar tu valoración</p>
              <button onClick={() => window.location.href='/login'} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-blue-700 transition-all">
                Ir al Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Valoración del Sitio</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: num })}
                      className={`text-2xl p-2 rounded-xl transition-all ${formData.rating >= num ? 'grayscale-0 scale-110' : 'grayscale opacity-30 scale-100'}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Tu Experiencia</label>
                <textarea
                  required
                  placeholder="¿Cómo te ha ayudado el cancionero en tu ministerio?"
                  className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all text-sm h-32"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">¿Qué recomendarías mejorar?</label>
                <textarea
                  placeholder="Queremos escucharte: nuevas funciones, cantos que faltan, etc."
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
                {isSubmitting ? 'Enviando Testimonio...' : 'Publicar mi Experiencia'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
