import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { addressMiddlewares } from '../middlewares/address';

const router: Router = Router();

router.post(
  '/create',
  authMethods.isUserAuthorized,
  addressMiddlewares.createAddress
);
router.get(
  '/user',
  authMethods.isUserAuthorized,
  addressMiddlewares.getUserAddresses
);

router.delete(
  '/delete/:id',
  authMethods.isUserAuthorized,
  addressMiddlewares.removeAddress
);
export const addressRoutes: Router = router;
