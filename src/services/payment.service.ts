import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

interface PaymentItem {
  title: string;
  quantity: number;
  unitPrice: number;
}

export const createPaymentPreference = async (items: PaymentItem[], orderId: string) => {
  if (!process.env.MP_ACCESS_TOKEN) {
    throw new Error('MercadoPago not configured');
  }

  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: items.map((item, index) => ({
        id: String(index + 1),
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: 'ARS',
      })),
      external_reference: orderId,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/payment/success`,
        failure: `${process.env.FRONTEND_URL}/payment/failure`,
        pending: `${process.env.FRONTEND_URL}/payment/pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
    },
  });

  return {
    id: result.id,
    init_point: result.init_point,
    sandbox_init_point: result.sandbox_init_point,
  };
};
