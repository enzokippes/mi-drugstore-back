import { z } from 'zod';

export const promotionSchema = z.object({
  title: z.string().min(1, 'El titulo es requerido').max(100, 'El titulo no puede superar 100 caracteres').trim(),
  description: z.string().min(1, 'La descripcion es requerida').max(500, 'La descripcion no puede superar 500 caracteres').trim(),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  originalPrice: z.coerce.number().positive('El precio original debe ser mayor a 0').optional(),
  active: z.coerce.boolean().default(true),
});
