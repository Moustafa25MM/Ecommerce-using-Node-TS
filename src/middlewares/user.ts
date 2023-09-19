import { userControllers } from '../controllers/user';
import { Request, Response } from 'express';

const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const user = await userControllers.create({
    firstName,
    lastName,
    email,
    password,
  });
  return res.status(201).json(user);
};

export const userMiddlewares = {
  createUser,
};
