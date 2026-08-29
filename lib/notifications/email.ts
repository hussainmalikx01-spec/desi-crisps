/**
 * Email notifications via Resend (fallback channel — WhatsApp is primary).
 * Set RESEND_API_KEY and NOTIFICATION_FROM_EMAIL in .env to enable.
 */

const RESEND_API_URL = "https://api.resend.com/emails";

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATION_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("[email] Skipping send — RESEND_API_KEY or NOTIFICATION_FROM_EMAIL not set.");
    return false;
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    return res.ok;
  } catch (err) {
    console.error("[email] Error sending:", err);
    return false;
  }
}

export async function emailAdminNewOrder(order: {
  id: string;
  customerName: string;
  total: string;
  itemsSummary: string;
}) {
  const adminEmail = process.env.NOTIFICATION_ADMIN_EMAIL;
  if (!adminEmail) return;

  await sendEmail(
    adminEmail,
    `New Order #${order.id.slice(-6).toUpperCase()}`,
    `<p>Customer: ${order.customerName}</p><p>Items: ${order.itemsSummary}</p><p>Total: Rs. ${order.total}</p>`
  );
}

export async function emailCustomerOrderConfirmation(
  customerEmail: string,
  orderId: string,
  total: string
) {
  await sendEmail(
    customerEmail,
    "Your Desi Crisps order is confirmed!",
    `<p>Thank you for your order #${orderId.slice(-6).toUpperCase()}!</p><p>Total: Rs. ${total}</p><p>We'll notify you as it's on its way. Quality you can trust.</p>`
  );
}
