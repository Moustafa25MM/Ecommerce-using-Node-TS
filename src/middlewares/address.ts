import { Types } from 'mongoose';
import { addressControllers } from '../controllers/address';
import { Request, Response } from 'express';

interface UserPayload {
  id: Types.ObjectId;
}

interface RequestWithUser extends Request {
  user: UserPayload;
}

const createAddress = async (req: any, res: Response) => {
  const { unitNumber, streetNumber, addressLine, city, region, postalCode } =
    req.body;
  try {
    console.log(req);
    const address = await addressControllers.create({
      unitNumber,
      streetNumber,
      addressLine,
      city,
      region,
      postalCode,
      userId: req.user.id,
    });
    if (!address) {
      throw new Error('Failed to create address');
    }

    return res.status(201).json(address);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
const getUserAddresses = async (req: any, res: Response) => {
  const addresses = await addressControllers.getByUser(req.user.id);
  return res.status(200).json(addresses);
};

const removeAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const existingAddress = await addressControllers.getById(id);
  if (!existingAddress) {
    throw new Error('Address not found');
  }
  const removedAddress = await addressControllers.remove(id);
  return res
    .status(200)
    .json({ address: removedAddress, msg: 'deleted Successfully' });
};

export const addressMiddlewares = {
  createAddress,
  getUserAddresses,
  removeAddress,
};
