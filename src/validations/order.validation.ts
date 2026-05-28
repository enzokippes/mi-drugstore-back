import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'productId es requerido'),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
  price: z.number().positive('El precio debe ser mayor a 0'),
});

export const createOrderSchema = z.object({
  total: z.number().positive('El total debe ser mayor a 0'),
  items: z.array(orderItemSchema).min(1, 'El pedido debe tener al menos un item'),
  deliveryType: z.enum(['PICKUP', 'DELIVERY'], { message: 'deliveryType debe ser PICKUP o DELIVERY' }),
  address: z.string().min(5, 'La direccion debe tener al menos 5 caracteres').optional(),
  phone: z.string().min(1, 'El telefono es requerido').optional(),
  notes: z.string().max(500, 'Las notas no pueden superar 500 caracteres').optional(),
  deliveryTime: z.string().optional(),
}).refine(
  (data) => data.deliveryType !== 'DELIVERY' || (!!data.address && !!data.phone && !!data.deliveryTime),
  { message: 'Direccion, telefono y horario son requeridos para delivery' }
);

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'], { message: 'Status invalido' }),
});
