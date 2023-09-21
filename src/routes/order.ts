import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { orderMiddlewares } from '../middlewares/order';

const router: Router = Router();

router.post(
  '/create',
  authMethods.isUserAuthorized,
  orderMiddlewares.createOrderFromCart
);

export const orderRoutes: Router = router;
