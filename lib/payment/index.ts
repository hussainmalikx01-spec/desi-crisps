/**
 * Pluggable payment layer.
 *
 * Every payment method (COD today, JazzCash/Easypaisa/Stripe tomorrow)
 * implements this same PaymentProvider interface. The checkout page and
 * order API only ever talk to `getPaymentProvider(method)` — they never
 * know or care which concrete provider is behind it.
 *
 * TO ADD A NEW PAYMENT METHOD LATER:
 * 1. Add the new value to the `PaymentMethod` enum in prisma/schema.prisma
 * 2. Create a new file here, e.g. `jazzcash.ts`, that implements PaymentProvider
 * 3. Register it in the `providers` map below
 * 4. Add it as an option in the checkout UI (components/storefront/PaymentMethodSelect.tsx)
 * No other file needs to change.
 */

export type PaymentResult = {
  success: boolean;
  reference?: string; // transaction ID from the gateway, if any
  message: string;
};

export interface PaymentProvider {
  /** Human-readable name shown in the checkout UI and admin order view. */
  label: string;
  /**
   * Called when an order is placed. For COD this just confirms the order
   * immediately. A real gateway would redirect to a hosted payment page
   * or call its charge API here instead.
   */
  processPayment(orderId: string, amount: number): Promise<PaymentResult>;
}

class CashOnDeliveryProvider implements PaymentProvider {
  label = "Cash on Delivery";

  async processPayment(orderId: string): Promise<PaymentResult> {
    // Nothing to charge now — payment happens at the doorstep.
    // We just mark the order as confirmed and move on.
    return {
      success: true,
      message: `Order ${orderId} placed. Customer will pay in cash on delivery.`,
    };
  }
}

const providers: Record<string, PaymentProvider> = {
  COD: new CashOnDeliveryProvider(),
};

export function getPaymentProvider(method: string): PaymentProvider {
  const provider = providers[method];
  if (!provider) throw new Error(`Unknown payment method: ${method}`);
  return provider;
}

export function getAvailablePaymentMethods(): { value: string; label: string }[] {
  return Object.entries(providers).map(([value, provider]) => ({
    value,
    label: provider.label,
  }));
}
