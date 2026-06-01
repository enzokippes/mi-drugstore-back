import { z } from 'zod';

export const redeemPointsSchema = z.object({
  rewardId: z.string().min(1, 'La recompensa es requerida'),
});

export const awardPointsSchema = z.object({
  userId: z.string().min(1, 'El usuario es requerido'),
  points: z.number().int().positive('Los puntos deben ser un numero entero positivo'),
  reason: z.string().min(1, 'La razon es requerida').max(200).optional(),
});

export const pointRewardSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede superar 100 caracteres').trim(),
  description: z.string().max(500, 'La descripcion no puede superar 500 caracteres').optional(),
  pointsCost: z.number().int().positive('El costo en puntos debe ser mayor a 0'),
  productId: z.string().optional(),
  image: z.string().optional(),
  active: z.boolean().optional(),
});
