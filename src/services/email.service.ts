import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
  id: string;
  total: number;
  deliveryType: string;
  items: Array<{
    quantity: number;
    price: number;
    productName?: string | null;
    product?: { name: string } | null;
  }>;
  user?: {
    name: string;
    email: string;
  } | null;
}

const buildOrderHtml = (order: OrderEmailData): string => {
  const itemsHtml = order.items.map(item => {
    const name = item.productName || item.product?.name || 'Producto';
    return `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #374151;">${name}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #374151; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #374151; text-align: right;">$${(item.price * item.quantity).toLocaleString('es-AR')}</td>
      </tr>
    `;
  }).join('');

  return `
    <div style="font-family: system-ui, sans-serif; background-color: #030712; color: #fff; padding: 40px 20px;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #111827; border-radius: 16px; padding: 32px; border: 1px solid #1f2937;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #22c55e; margin: 0; font-size: 24px;">Barba Negra Drugstore</h1>
          <p style="color: #9ca3af; margin: 8px 0 0;">Tu pedido fue recibido</p>
        </div>
        <div style="background-color: #1f2937; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Pedido #${order.id.slice(0, 8).toUpperCase()}</p>
          <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0;">${order.deliveryType === 'DELIVERY' ? 'Envio a domicilio' : 'Retiro en local'}</p>
        </div>
        <table style="width: 100%; color: #e5e7eb; font-size: 14px; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #374151;">
              <th style="text-align: left; padding: 8px 0;">Producto</th>
              <th style="text-align: center; padding: 8px 0;">Cant.</th>
              <th style="text-align: right; padding: 8px 0;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #374151; display: flex; justify-content: space-between;">
          <span style="color: #9ca3af; font-size: 16px;">Total</span>
          <span style="color: #22c55e; font-size: 24px; font-weight: bold;">$${order.total.toLocaleString('es-AR')}</span>
        </div>
        <div style="margin-top: 32px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>Gracias por tu compra!</p>
          <p>H. Primo ESQ Balcarce, Concordia, Entre Rios</p>
        </div>
      </div>
    </div>
  `;
};

export const sendOrderConfirmation = async (to: string, order: OrderEmailData) => {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Barba Negra <onboarding@resend.dev>',
      to,
      subject: `Pedido #${order.id.slice(0, 8).toUpperCase()} confirmado - Barba Negra Drugstore`,
      html: buildOrderHtml(order),
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

export const sendAdminOrderNotification = async (order: OrderEmailData) => {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
    return;
  }

  try {
    await resend.emails.send({
      from: 'Barba Negra <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: `Nuevo pedido #${order.id.slice(0, 8).toUpperCase()} - $${order.total.toLocaleString('es-AR')}`,
      html: `
        <div style="font-family: system-ui, sans-serif; padding: 20px;">
          <h2 style="color: #22c55e;">Nuevo pedido recibido</h2>
          <p><strong>Cliente:</strong> ${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})</p>
          <p><strong>Pedido:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
          <p><strong>Total:</strong> $${order.total.toLocaleString('es-AR')}</p>
          <p><strong>Tipo:</strong> ${order.deliveryType === 'DELIVERY' ? 'Envio a domicilio' : 'Retiro en local'}</p>
          <p><strong>Items:</strong> ${order.items.length}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};
