import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { orderMiddlewares } from '../middlewares/order';

const router: Router = Router();

router.post(
  '/create',
  authMethods.isUserAuthorized,
  orderMiddlewares.createOrderFromCart
);

router.post(
  '/shipped/:orderId',
  authMethods.isAdminAuthorized,
  orderMiddlewares.shipOrder
);

router.post(
  '/delivered/:orderId',
  authMethods.isAdminAuthorized,
  orderMiddlewares.deliverOrder
);

router.get(
  '/user',
  authMethods.isUserAuthorized,
  orderMiddlewares.getOrdersByUserId
);

router.get(
  '/product/:id',
  authMethods.isAdminAuthorized,
  orderMiddlewares.getOrdersByProductId
);

export const orderRoutes: Router = router;
