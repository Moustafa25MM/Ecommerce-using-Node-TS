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

export const addressMiddlewares = {
  createAddress,
};
