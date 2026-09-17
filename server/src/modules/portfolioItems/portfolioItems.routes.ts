import { Router } from 'express';
import { authenticate } from '../shared/middleware/auth.middleware.js';
import {
    createPortfolioItemController,
    deletePortfolioItemController,
    getMyPortfolioItemController,
    getMyPortfolioItemsController,
    updatePortfolioItemController,
} from './portfolioItems.controller.js';

const router = Router();

router.get('/:artistId/:itemId', authenticate, getMyPortfolioItemController);
router.get('/:artistId', authenticate, getMyPortfolioItemsController);
router.post('/:artistId', authenticate, createPortfolioItemController);
router.put('/:artistId/:itemId', authenticate, updatePortfolioItemController);
router.delete(
    '/:artistId/:itemId',
    authenticate,
    deletePortfolioItemController
);

export default router;
