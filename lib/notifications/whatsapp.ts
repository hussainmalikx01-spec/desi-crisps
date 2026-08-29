/**
 * WhatsApp Business Cloud API sender.
 *
 * Setup needed (documented in full in README.md):
 * 1. Create a Meta developer account + WhatsApp Business app
 * 2. Get a permanent access token + phone number ID
 * 3. Set WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_ADMIN_NUMBER
 *    in your .env file
 *
 * If the WhatsApp number ever changes, you only need to update
 * WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ADMIN_NUMBER in .env — no code changes.
 */

const WHATSAPP_API_URL = "https://graph.facebook.com/v20.0";

async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn("[whatsapp] Skipping send — WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set.");
    return false;
  }

  try {
    const res = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    });
    if (!res.ok) {
      console.error("[whatsapp] Send failed:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[whatsapp] Error sending message:", err);
    return false;
  }
}

export async function notifyAdminNewOrder(order: {
  id: string;
  customerName: string;
  total: string;
  itemsSummary: string;
}) {
  const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  if (!adminNumber) return;

  const message = `🔔 New Order #${order.id.slice(-6).toUpperCase()}\nCustomer: ${order.customerName}\nItems: ${order.itemsSummary}\nTotal: Rs. ${order.total}\n\nCheck admin panel for full details.`;

  await sendWhatsAppMessage(adminNumber, message);
}

export async function notifyCustomerOrderStatus(
  customerPhone: string,
  orderId: string,
  status: string
) {
  const statusMessages: Record<string, string> = {
    CONFIRMED: "has been confirmed! We're preparing your order.",
    PROCESSING: "is being packed.",
    SHIPPED: "is on its way!",
    DELIVERED: "has been delivered. Thank you for choosing Desi Crisps!",
    CANCELLED: "has been cancelled. Contact us if this is unexpected.",
  };

  const statusText = statusMessages[status] || `status is now ${status}`;
  const message = `Desi Crisps: Your order #${orderId.slice(-6).toUpperCase()} ${statusText}`;

  await sendWhatsAppMessage(customerPhone, message);
}
