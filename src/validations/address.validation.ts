import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1, 'El nombre es requerido').max(50),
  street: z.string().min(3, 'La calle es requerida'),
  number: z.string().min(1, 'El numero es requerido'),
  notes: z.string().max(200).optional(),
  zoneId: z.string().optional(),
  isDefault: z.boolean().optional(),
});
