import { Router } from 'express';
import { authenticate } from '../shared/middleware/auth.middleware.js';
import {
    deleteAccountController,
    updateUserAvatarController,
    updateUserController,
    updateUserFullNameController,
} from './user.controller.js';

const router = Router();

router.put('/', authenticate, updateUserController);
router.patch('/full-name', authenticate, updateUserFullNameController);
router.patch('/avatar', authenticate, updateUserAvatarController);
router.delete('/', authenticate, deleteAccountController);

export default router;
