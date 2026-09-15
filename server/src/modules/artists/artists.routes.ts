import { Router } from 'express';
import { authenticate } from '../shared/middleware/auth.middleware.js';
import {
    createArtistProfileController,
    getAllArtistsController,
    getArtistByIdController,
    getMyArtistProfileController,
    updateArtistAddressController,
    updateArtistAvailabilityStatusController,
    updateArtistBioController,
    updateArtistCommissionPricingController,
    updateArtistDisplayNameController,
    updateArtistHeadlineController,
    updateArtistMediumsController,
    updateArtistProfileVisibilityController,
    updateArtistSocialLinksController,
    updateArtistSpecialtiesController,
    updateArtistStylesController,
} from './artists.controller.js';

const router = Router();

router.get('/all', getAllArtistsController);
router.get('/me', authenticate, getMyArtistProfileController);
router.get('/:artistId', getArtistByIdController);
router.post('/', authenticate, createArtistProfileController);
router.patch('/display-name', authenticate, updateArtistDisplayNameController);
router.patch('/headline', authenticate, updateArtistHeadlineController);
router.patch('/bio', authenticate, updateArtistBioController);
router.patch('/address', authenticate, updateArtistAddressController);
router.patch('/specialties', authenticate, updateArtistSpecialtiesController);
router.patch('/mediums', authenticate, updateArtistMediumsController);
router.patch('/styles', authenticate, updateArtistStylesController);
router.patch(
    '/commission-pricing',
    authenticate,
    updateArtistCommissionPricingController
);
router.patch(
    '/availability-status',
    authenticate,
    updateArtistAvailabilityStatusController
);
router.patch(
    '/profile-visibility',
    authenticate,
    updateArtistProfileVisibilityController
);
router.patch('/social-links', authenticate, updateArtistSocialLinksController);

export default router;
