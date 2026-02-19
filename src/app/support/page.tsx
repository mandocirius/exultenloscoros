"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SupportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login'); // Redirect unauthenticated users
    }
  }, [user, authLoading, router]);

  const handleSupportClick = async () => {
    if (!user) return; // Should already be redirected by useEffect

    setIsRedirecting(true);
    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
      console.log('Iniciando checkout con Price ID:', priceId);

      const idToken = await user.getIdToken();
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error creating checkout session:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      router.push(url); // Redirect to Stripe Checkout
    } catch (error) {
      console.error('Error initiating Stripe checkout:', error);
      setIsRedirecting(false);
      alert('Hubo un error al iniciar el proceso de pago. Por favor, inténtalo de nuevo.');
    }
  };

  if (authLoading || !user || isRedirecting) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-gray-800">Apoya este Proyecto</h2>
        <p className="text-gray-600">
          Tu colaboración de <span className="font-bold text-green-600">$0.50 centavos de dólar mensual</span> nos ayuda a mantener y mejorar esta plataforma de cantos litúrgicos. Con tu apoyo, podemos seguir ofreciendo este recurso valioso para la comunidad y llegar a más hermanos.
        </p>
        <p className="text-xl font-semibold text-blue-600">
          ¡Únete y sé parte de este apostolado digital!
        </p>
        <button
          onClick={handleSupportClick}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={isRedirecting}
        >
          {isRedirecting ? 'Redirigiendo a Stripe...' : 'Apoyar ahora ($0.50/mes)'}
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Serás redirigido a una página segura de Stripe para completar tu suscripción.
        </p>
      </div>
    </div>
  );
}
