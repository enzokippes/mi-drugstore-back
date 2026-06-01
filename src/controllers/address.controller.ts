import { Request, Response } from 'express';
import * as addressService from '../services/address.service';
import { sendSuccess, sendError } from '../utils/response';

export const getMyAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await addressService.getUserAddressesService(req.user!.id);
    sendSuccess(res, addresses);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching addresses', 500);
  }
};

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const address = await addressService.getAddressByIdService(req.params.id as string, req.user!.id);
    if (!address) return sendError(res, 'Direccion no encontrada', 404);
    sendSuccess(res, address);
  } catch (error: any) {
    sendError(res, error.message || 'Error fetching address', 500);
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const address = await addressService.createAddressService({
      ...req.body,
      userId: req.user!.id,
    });
    sendSuccess(res, address, 'Direccion creada exitosamente', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Error creating address', 400);
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const address = await addressService.updateAddressService(
      req.params.id as string,
      req.user!.id,
      req.body
    );
    sendSuccess(res, address, 'Direccion actualizada exitosamente');
  } catch (error: any) {
    sendError(res, error.message || 'Error updating address', 400);
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await addressService.deleteAddressService(req.params.id as string, req.user!.id);
    sendSuccess(res, null, 'Direccion eliminada exitosamente');
  } catch (error: any) {
    sendError(res, error.message || 'Error deleting address', 400);
  }
};
