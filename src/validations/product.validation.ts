import { z } from 'zod';

const stringBoolean = z.union([
  z.boolean(),
  z.string().transform(val => val === 'true'),
]).default(false);

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede superar 100 caracteres').trim(),
  description: z.string().max(1000, 'La descripcion no puede superar 1000 caracteres').optional(),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo').optional().default(0),
  unlimitedStock: stringBoolean,
  categoryId: z.string().min(1, 'La categoria es requerida'),
  isCombo: stringBoolean,
  isFeatured: stringBoolean,
});
