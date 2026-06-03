import { Resend } from 'resend';

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

interface OrderEmailData {
  id: string;
  total: number;
  deliveryType: string;
  deliveryCost?: number;
  address?: string | null;
  phone?: string | null;
  deliveryTime?: string | null;
  items: Array<{
    quantity: number;
    price: number;
    productName?: string | null;
    product?: { name: string } | null;
  }>;
  deliveryZone?: {
    name: string;
  } | null;
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

  const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCost = order.deliveryCost || 0;

  const deliveryInfoHtml = order.deliveryType === 'DELIVERY' ? `
    <div style="background-color: #1f2937; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
      <p style="color: #fbbf24; font-size: 14px; margin: 0 0 8px; font-weight: bold;">Envio a domicilio</p>
      <p style="color: #d1d5db; font-size: 13px; margin: 4px 0;"><strong>Zona:</strong> ${order.deliveryZone?.name || 'N/A'}</p>
      ${order.address ? `<p style="color: #d1d5db; font-size: 13px; margin: 4px 0;"><strong>Direccion:</strong> ${order.address}</p>` : ''}
      ${order.phone ? `<p style="color: #d1d5db; font-size: 13px; margin: 4px 0;"><strong>Telefono:</strong> ${order.phone}</p>` : ''}
      ${order.deliveryTime ? `<p style="color: #d1d5db; font-size: 13px; margin: 4px 0;"><strong>Horario:</strong> ${order.deliveryTime}</p>` : ''}
      <p style="color: #d1d5db; font-size: 13px; margin: 4px 0;"><strong>Costo de envio:</strong> $${deliveryCost.toLocaleString('es-AR')}</p>
    </div>
  ` : `
    <div style="background-color: #1f2937; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
      <p style="color: #22c55e; font-size: 14px; margin: 0; font-weight: bold;">Retiro en local</p>
      <p style="color: #9ca3af; font-size: 13px; margin: 4px 0;">H. Primo ESQ Balcarce, Concordia</p>
    </div>
  `;

  return `
    <div style="font-family: system-ui, sans-serif; background-color: #030712; color: #fff; padding: 40px 20px;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #111827; border-radius: 16px; padding: 32px; border: 1px solid #1f2937;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 24px;">Barba Negra Drugstore</h1>
          <p style="color: #9ca3af; margin: 8px 0 0;">Tu pedido fue recibido</p>
        </div>
        <div style="background-color: #1f2937; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Pedido #${order.id.slice(0, 8).toUpperCase()}</p>
        </div>
        ${deliveryInfoHtml}
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
        <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #374151;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #9ca3af; font-size: 14px;">Productos</span>
            <span style="color: #e5e7eb; font-size: 14px;">$${itemsTotal.toLocaleString('es-AR')}</span>
          </div>
          ${deliveryCost > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #9ca3af; font-size: 14px;">Envio</span>
            <span style="color: #e5e7eb; font-size: 14px;">$${deliveryCost.toLocaleString('es-AR')}</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #374151;">
            <span style="color: #9ca3af; font-size: 16px;">Total</span>
            <span style="color: #fbbf24; font-size: 24px; font-weight: bold;">$${order.total.toLocaleString('es-AR')}</span>
          </div>
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
  const resend = getResend();
  if (!resend) {
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
  const resend = getResend();
  if (!resend || !process.env.ADMIN_EMAIL) {
    return;
  }

  try {
    await resend.emails.send({
      from: 'Barba Negra <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: `Nuevo pedido #${order.id.slice(0, 8).toUpperCase()} - $${order.total.toLocaleString('es-AR')}`,
      html: `
        <div style="font-family: system-ui, sans-serif; padding: 20px;">
          <h2 style="color: #fbbf24;">Nuevo pedido recibido</h2>
          <p><strong>Cliente:</strong> ${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})</p>
          <p><strong>Pedido:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
          <p><strong>Total:</strong> $${order.total.toLocaleString('es-AR')}</p>
          <p><strong>Tipo:</strong> ${order.deliveryType === 'DELIVERY' ? 'Envio a domicilio' : 'Retiro en local'}</p>
          ${order.deliveryZone ? `<p><strong>Zona:</strong> ${order.deliveryZone.name}</p>` : ''}
          ${order.address ? `<p><strong>Direccion:</strong> ${order.address}</p>` : ''}
          ${order.phone ? `<p><strong>Telefono:</strong> ${order.phone}</p>` : ''}
          ${order.deliveryTime ? `<p><strong>Horario:</strong> ${order.deliveryTime}</p>` : ''}
          ${order.deliveryCost ? `<p><strong>Costo envio:</strong> $${order.deliveryCost.toLocaleString('es-AR')}</p>` : ''}
          <p><strong>Items:</strong> ${order.items.length}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};

const statusMessages: Record<string, { subject: string; message: string; color: string; icon: string }> = {
  CONFIRMED: {
    subject: 'Tu pedido fue confirmado',
    message: 'Tu pedido fue confirmado y estamos preparandolo.',
    color: '#3b82f6',
    icon: '✅',
  },
  IN_TRANSIT: {
    subject: 'Tu pedido esta en camino',
    message: 'Tu pedido salio y va en camino a tu direccion.',
    color: '#a855f7',
    icon: '🚀',
  },
  DELIVERED: {
    subject: 'Tu pedido fue entregado',
    message: 'Tu pedido fue entregado con exito. Gracias por tu compra!',
    color: '#22c55e',
    icon: '🎉',
  },
  CANCELLED: {
    subject: 'Tu pedido fue cancelado',
    message: 'Tu pedido fue cancelado. Si tenes alguna duda, contactanos.',
    color: '#ef4444',
    icon: '❌',
  },
};

export const sendStatusChangeEmail = async (to: string, orderId: string, status: string) => {
  const resend = getResend();
  if (!resend) return;

  const config = statusMessages[status];
  if (!config) return;

  try {
    await resend.emails.send({
      from: 'Barba Negra <onboarding@resend.dev>',
      to,
      subject: `${config.subject} - Pedido #${orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: system-ui, sans-serif; background-color: #030712; color: #fff; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #111827; border-radius: 16px; padding: 32px; border: 1px solid #1f2937;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #fbbf24; margin: 0; font-size: 24px;">Barba Negra Drugstore</h1>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="font-size: 48px; margin-bottom: 16px;">${config.icon}</div>
              <h2 style="color: ${config.color}; margin: 0 0 8px; font-size: 20px;">${config.subject}</h2>
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">${config.message}</p>
            </div>
            <div style="background-color: #1f2937; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">Pedido #${orderId.slice(0, 8).toUpperCase()}</p>
            </div>
            <div style="margin-top: 32px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>H. Primo ESQ Balcarce, Concordia, Entre Rios</p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending status change email:', error);
  }
};

export const sendPasswordResetEmail = async (to: string, token: string, userName: string) => {
  const resend = getResend();
  if (!resend) {
    console.log('RESEND_API_KEY not configured, skipping password reset email');
    return;
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: 'Barba Negra <onboarding@resend.dev>',
      to,
      subject: 'Restablecer contraseña - Barba Negra Drugstore',
      html: `
        <div style="font-family: system-ui, sans-serif; background-color: #030712; color: #fff; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #111827; border-radius: 16px; padding: 32px; border: 1px solid #1f2937;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #fbbf24; margin: 0; font-size: 24px;">Barba Negra Drugstore</h1>
              <p style="color: #9ca3af; margin: 8px 0 0;">Solicitud de recuperacion de contraseña</p>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="font-size: 48px; margin-bottom: 16px;">🔑</div>
              <h2 style="color: #e5e7eb; margin: 0 0 8px; font-size: 20px;">Hola ${userName},</h2>
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">Recibimos una solicitud para restablecer tu contraseña. Hacé click en el boton de abajo para crear una nueva contraseña.</p>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${resetLink}" style="display: inline-block; background-color: #fbbf24; color: #030712; font-weight: bold; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 16px;">Restablecer contraseña</a>
            </div>
            <div style="background-color: #1f2937; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">Este link expira en 1 hora.</p>
              <p style="color: #6b7280; font-size: 11px; margin: 8px 0 0;">Si no pediste este email, ignoralo.</p>
            </div>
            <div style="margin-top: 32px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>H. Primo ESQ Balcarce, Concordia, Entre Rios</p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};
