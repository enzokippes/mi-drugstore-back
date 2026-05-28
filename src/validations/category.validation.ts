import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'El nombre no puede superar 50 caracteres').trim(),
});
