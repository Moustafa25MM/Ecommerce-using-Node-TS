import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { addressMiddlewares } from '../middlewares/address';

const router: Router = Router();

router.post(
  '/create',
  authMethods.isUserAuthorized,
  addressMiddlewares.createAddress
);

export const addressRoutes: Router = router;
