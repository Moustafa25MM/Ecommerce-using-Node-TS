import { Router } from 'express';
import { userMiddlewares } from '../middlewares/user';
import { loginMethods } from '../middlewares/login';

const router = Router();

router.use('/login', loginMethods.userLogin);
router.post('/register', userMiddlewares.createUser);
export const userRoutes: Router = router;
