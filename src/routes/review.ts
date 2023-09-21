import { Router } from 'express';
import { reviewMiddlewares } from '../middlewares/review';
import { authMethods } from '../middlewares/auth';

const router: Router = Router();

router.post('/add', authMethods.isUserAuthorized, reviewMiddlewares.addReview);
router.put(
  '/update/:id',
  authMethods.isUserAuthorized,
  reviewMiddlewares.updateReview
);
router.delete(
  '/delete/:id',
  authMethods.isUserAuthorized,
  reviewMiddlewares.deleteReview
);

router.get(
  '/product/:productId',
  authMethods.isUserAuthorized,
  reviewMiddlewares.getReviewsForProduct
);

export const reviewRoutes: Router = router;
