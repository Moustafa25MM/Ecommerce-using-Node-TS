import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { NextFunction } from 'express';
import { userControllers } from '../controllers/user';
import { adminControllers } from '../controllers/admin';

dotenv.config();

const JWTSecret = process.env.JWT_SECRET;

const hashPassword = (password: string): String =>
  bcrypt.hashSync(password as string, 10);

const comparePassword = async (
  enteredPassword: string,
  DB_Password: any
): Promise<boolean> => {
  const result = await bcrypt.compare(enteredPassword, DB_Password);
  return result;
};

type TokenPayLoad = {
  id: string;
};
const generateJWT = (payload: TokenPayLoad): String =>
  jwt.sign(payload, JWTSecret as string, { expiresIn: '7d' });

const isUserAuthorized = async (req: any, res: any, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  try {
    const payload: { id: string } = jwt.verify(token, JWTSecret as string) as {
      id: string;
    };

    const userData = await userControllers.getUserById(payload.id);
    if (!userData) {
      return res.status(400);
    }
    await userControllers.setActivity(userData.id, true);
    req.user = {
      id: userData.id,
      email: userData.email,
    };

    next();
  } catch (error) {
    const decoded = jwt.decode(token) as TokenPayLoad | null;
    if (decoded?.id) {
      await userControllers.setActivity(decoded.id, false);
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
const isAdminAuthorized = async (req: any, res: any, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  try {
    const payload: { id: string } = jwt.verify(token, JWTSecret as string) as {
      id: string;
    };

    const adminData = await adminControllers.getAdminById(payload.id);
    if (!adminData) {
      return res.status(400);
    }
    await adminControllers.setActivity(adminData.id, true);
    req.user = {
      id: adminData.id,
      email: adminData.email,
    };

    next();
  } catch (error) {
    const decoded = jwt.decode(token) as TokenPayLoad | null;
    if (decoded?.id) {
      await adminControllers.setActivity(decoded.id, false);
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
export const authMethods = {
  hashPassword,
  comparePassword,
  generateJWT,
  isUserAuthorized,
  isAdminAuthorized,
};
