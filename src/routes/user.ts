import { Router } from 'express';
import { userMiddlewares } from '../middlewares/user';
import { loginMethods } from '../middlewares/login';

const router = Router();

router.use('/login', loginMethods.userLogin);
router.post('/register', userMiddlewares.createUser);
router.patch('/update/:id', userMiddlewares.updateUser);
router.get('/all', userMiddlewares.getAllUsers);
export const userRoutes: Router = router;
