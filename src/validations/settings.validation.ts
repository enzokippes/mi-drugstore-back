import { z } from 'zod';

export const settingSchema = z.object({
  key: z.string().min(1, 'La clave es requerida').max(50, 'La clave no puede superar 50 caracteres').trim(),
  value: z.string().max(500, 'El valor no puede superar 500 caracteres'),
});
