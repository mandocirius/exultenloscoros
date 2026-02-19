// src/app/payment/cancel/page.tsx
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-red-600">Pago Cancelado</h2>
        <p className="text-gray-700">
          El proceso de pago ha sido cancelado. Si cambias de opinión, puedes intentarlo de nuevo.
        </p>
        <Link href="/support" className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700">
          Reintentar apoyo
        </Link>
        <Link href="/" className="inline-block ml-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
