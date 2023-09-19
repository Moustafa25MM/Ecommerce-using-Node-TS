import { userControllers } from '../controllers/user';
import { Request, Response } from 'express';
import { authMethods } from './auth';

const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  let { password } = req.body;

  password = authMethods.hashPassword(password);

  try {
    const existingUser = await userControllers.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const user = await userControllers.create({
      firstName,
      lastName,
      email,
      password,
    });
    if (!user) {
      throw new Error('Failed to create employee');
    }

    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const userMiddlewares = {
  createUser,
};
