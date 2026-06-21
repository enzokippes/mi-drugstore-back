import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'El nombre no puede superar 200 caracteres').trim().optional(),
  email: z.string().email('Email invalido').max(200).optional(),
  phone: z.string().max(50, 'El telefono no puede superar 50 caracteres').optional().nullable(),
  role: z.enum(['USER', 'ADMIN'], { message: 'Rol invalido' }).optional(),
});

export const banUserSchema = z.object({
  banned: z.boolean(),
});

export const adjustPointsSchema = z.object({
  points: z.number().int('Los puntos deben ser un numero entero').refine((v) => v !== 0, 'Los puntos no pueden ser 0'),
  reason: z.string().min(1, 'La razon es requerida').max(500, 'La razon no puede superar 500 caracteres').trim(),
});
