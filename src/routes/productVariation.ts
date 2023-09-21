import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { productVariationMiddlewares as pv } from '../middlewares/productVariation';

const router: Router = Router();

router.post(
  '/create',
  authMethods.isAdminAuthorized,
  pv.createProductVariation
);

export const productVariationRoutes: Router = router;
