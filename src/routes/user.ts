import { Router } from 'express';
import { userMiddlewares } from '../middlewares/user';

const router = Router();

router.post('/create', userMiddlewares.createUser);

export const userRoutes: Router = router;
