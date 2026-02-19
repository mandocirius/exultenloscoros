// src/lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover', // Versión actualizada para 2026
  typescript: true,
});

/**
 * Creates a Stripe Checkout Session for a subscription.
 * @param priceId The ID of the Stripe Price object.
 * @param customerEmail The email of the customer.
 * @param userId The internal user ID from Firebase/your database.
 * @param successUrl The URL to redirect to after successful checkout.
 * @param cancelUrl The URL to redirect to if checkout is cancelled.
 * @returns A promise that resolves to the Stripe Checkout Session object.
 */
export async function createCheckoutSession(
  priceId: string,
  customerEmail: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Asegura que sea suscripción recurrente
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
      },
      // Permite que el usuario gestione su suscripción en el futuro
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
    });

    return session;
  } catch (error: any) {
    console.error('Error detallado de Stripe:', error.message);
    throw error;
  }
}
