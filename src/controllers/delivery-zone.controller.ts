import { Request, Response } from 'express';
import * as deliveryZoneService from '../services/delivery-zone.service';
import { sendSuccess, sendError } from '../utils/response';

export const getDeliveryZones = async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.active === 'true';
    const zones = await deliveryZoneService.getDeliveryZonesService(activeOnly);
    sendSuccess(res, zones);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching delivery zones', 500);
  }
};

export const getDeliveryZoneById = async (req: Request, res: Response) => {
  try {
    const zone = await deliveryZoneService.getDeliveryZoneByIdService(req.params.id as string);
    if (!zone) {
      return sendError(res, 'Delivery zone not found', 404);
    }
    sendSuccess(res, zone);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching delivery zone', 500);
  }
};

export const createDeliveryZone = async (req: Request, res: Response) => {
  try {
    const zone = await deliveryZoneService.createDeliveryZoneService(req.body);
    sendSuccess(res, zone, 'Delivery zone created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Error creating delivery zone', 400);
  }
};

export const updateDeliveryZone = async (req: Request, res: Response) => {
  try {
    const zone = await deliveryZoneService.updateDeliveryZoneService(req.params.id as string, req.body);
    sendSuccess(res, zone, 'Delivery zone updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Error updating delivery zone', 400);
  }
};

export const deleteDeliveryZone = async (req: Request, res: Response) => {
  try {
    await deliveryZoneService.deleteDeliveryZoneService(req.params.id as string);
    sendSuccess(res, null, 'Delivery zone deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Error deleting delivery zone', 400);
  }
};

export const calculateDeliveryCost = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.body;
    const result = await deliveryZoneService.calculateDeliveryCostService(zoneId);
    if (!result) {
      return sendError(res, 'Zona no disponible o inactiva', 404);
    }
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message || 'Error calculating delivery cost', 400);
  }
};
