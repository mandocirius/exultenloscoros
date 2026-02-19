// src/app/payment/success/page.tsx
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-green-600">¡Pago Exitoso!</h2>
        <p className="text-gray-700">
          Gracias por tu apoyo al Cancionero Litúrgico. Tu colaboración es muy valiosa para nosotros.
        </p>
        <p className="text-gray-600">
          Recibirás un correo de confirmación de tu suscripción.
        </p>
        <Link href="/" className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
