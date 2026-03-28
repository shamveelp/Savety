import { Router } from 'express';
import authRoutes from './user/auth.routes';

const router = Router();

router.use('/auth', authRoutes);
// You can add more user-related routes here, like profileRoutes, etc.

export default router;
