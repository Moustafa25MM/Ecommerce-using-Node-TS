import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { wishlistMiddlewares } from '../middlewares/wishlist';

const router: Router = Router();

router.post(
  '/add',
  authMethods.isUserAuthorized,
  wishlistMiddlewares.addProductToWishlist
);

export const wishlistRoutes: Router = router;
