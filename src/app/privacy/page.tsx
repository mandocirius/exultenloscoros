"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-4xl bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-10 border-b pb-6">
          Privacidad y Seguridad
        </h1>
        
        <div className="space-y-12 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-sm">1</span>
              Recopilación de Datos
            </h2>
            <p>
              En el Cancionero Católico Litúrgico, la santidad de su información es una prioridad. Recopilamos datos mínimos necesarios para ofrecerle una experiencia personalizada: su nombre y correo electrónico a través de Firebase Auth, y detalles de facturación procesados de forma externa y segura por Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-sm">2</span>
              Seguridad de sus Documentos
            </h2>
            <p>
              Los documentos PDF que usted consulta están protegidos mediante Amazon S3 con URLs firmadas temporalmente. Esto garantiza que el contenido litúrgico solo sea accesible para miembros autorizados de nuestra comunidad, evitando el uso indebido de los recursos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-sm">3</span>
              Uso de Cookies
            </h2>
            <p>
              Utilizamos cookies técnicas esenciales para mantener su sesión iniciada y Google Analytics para entender cómo mejorar nuestra biblioteca digital. No vendemos sus datos a terceros; nuestro único interés es el servicio ministerial.
            </p>
          </section>

          <section className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Compromiso de Integridad</h2>
            <p className="text-blue-800 italic">
              "Todo lo que hagan, háganlo de corazón, como para el Señor". Nos comprometemos a tratar su información con la misma ética y respeto con la que tratamos nuestra sagrada liturgia.
            </p>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t text-sm text-gray-400 text-center">
          Última actualización: Febrero 2026
        </div>
      </div>
    </div>
  );
}
