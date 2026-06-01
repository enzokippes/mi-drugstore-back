import { z } from 'zod';

export const deliveryZoneSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede superar 100 caracteres').trim(),
  basePrice: z.number().min(0, 'El precio base no puede ser negativo'),
  surcharge: z.number().min(0, 'El recargo no puede ser negativo').optional(),
  maxDistanceKm: z.number().positive('La distancia maxima debe ser mayor a 0').optional(),
  active: z.boolean().optional(),
});

export const calculateDeliverySchema = z.object({
  zoneId: z.string().min(1, 'La zona es requerida'),
});
