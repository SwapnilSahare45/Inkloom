import { Router } from 'express';
import { authenticate } from '../shared/middleware/auth.middleware.js';
import { updateUserController } from './user.controller.js';

const router = Router();

router.put('/', authenticate, updateUserController);

export default router;
