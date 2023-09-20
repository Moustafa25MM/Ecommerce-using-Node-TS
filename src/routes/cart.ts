import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { cartMiddlewares } from '../middlewares/cart';

const router: Router = Router();

router.post(
  '/add',
  authMethods.isUserAuthorized,
  cartMiddlewares.addProductToCart
);
router.post(
  '/decrement',
  authMethods.isUserAuthorized,
  cartMiddlewares.decrementProductQuantity
);
router.get(
  '/user/:userId',
  authMethods.isUserAuthorized,
  cartMiddlewares.getCartByUserId
);
router.delete(
  '/delete/:userId',
  authMethods.isUserAuthorized,
  cartMiddlewares.removeCart
);

export const cartRoutes: Router = router;
