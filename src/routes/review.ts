import { Router } from 'express';
import { reviewMiddlewares } from '../middlewares/review';
import { authMethods } from '../middlewares/auth';

const router: Router = Router();

router.post('/add', authMethods.isUserAuthorized, reviewMiddlewares.addReview);

export const reviewRoutes: Router = router;
