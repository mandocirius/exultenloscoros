// src/app/api/payments/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const { priceId: clientPriceId } = await request.json();
  const priceId = clientPriceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

  // Verify user's authentication from the client
  const authorization = request.headers.get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const idToken = authorization.split('Bearer ')[1];
  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = decodedToken.uid;
  const userEmail = decodedToken.email || '';

  if (!priceId) {
    console.error('Missing Stripe Price ID in both request and environment variables');
    return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
  }

  try {
    const session = await createCheckoutSession(
      priceId,
      userEmail,
      userId,
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`
    );
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error al crear la sesión de Stripe:', error.message);
    if (error.message.includes('Invalid API Key')) {
      return NextResponse.json({ error: 'Configuración incorrecta de Stripe (Clave API no válida)' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Error en la suscripción: ' + error.message }, { status: 500 });
  }
}
