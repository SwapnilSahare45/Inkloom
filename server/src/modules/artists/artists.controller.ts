import type { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../shared/utils/response.js';
import {
    CreateArtistProfileSchema,
    UpdateAddressSchema,
    UpdateAvailabilityStatusSchema,
    UpdateBioSchema,
    UpdateCommissionPricingSchema,
    UpdateDisplayNameSchema,
    UpdateHeadlineSchema,
    UpdateMediumsSchema,
    UpdateProfileVisibilitySchema,
    UpdateSocialLinksSchema,
    UpdateSpecialtiesSchema,
    UpdateStylesSchema,
} from './artists.schema.js';
import {
    createArtistProfileService,
    getAllArtistsService,
    getArtistByIdService,
    getMyArtistProfileService,
    updateArtistAddressService,
    updateArtistAvailabilityStatusService,
    updateArtistBioService,
    updateArtistCommissionPricingService,
    updateArtistDisplayNameService,
    updateArtistHeadlineService,
    updateArtistMediumsService,
    updateArtistProfileVisibilityService,
    updateArtistSocialLinksService,
    updateArtistSpecialtiesService,
    updateArtistStylesService,
} from './artists.service.js';

export async function getAllArtistsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const {
            specialty,
            medium,
            style,
            budget,
            availability,
            verified,
            sort,
            page,
            limit,
        } = req.query;

        const query = {
            ...(specialty && { specialty: String(specialty) }),
            ...(medium && { medium: String(medium) }),
            ...(style && { style: String(style) }),
            ...(budget && { budget: Number(budget) }),
            ...(availability && { availability: availability as any }),
            ...(verified !== undefined && { verified: verified === 'true' }),
            ...(sort && { sort: sort as any }),
            ...(page && { page: Number(page) }),
            ...(limit && { limit: Number(limit) }),
        };
        const result = await getAllArtistsService(query);
        ApiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
}

export async function getArtistByIdController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const result = await getArtistByIdService(
            req.params.artistId as string
        );
        ApiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
}

export async function createArtistProfileController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = CreateArtistProfileSchema.parse(req.body);
        const result = await createArtistProfileService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your artist profile created successfully.',
            201
        );
    } catch (error) {
        next(error);
    }
}

export async function updateArtistDisplayNameController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateDisplayNameSchema.parse(req.body);
        const result = await updateArtistDisplayNameService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your display name updated successfully.'
        );
    } catch (error) {
        next(error);
    }
}

export async function updateArtistHeadlineController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateHeadlineSchema.parse(req.body);
        const result = await updateArtistHeadlineService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(res, result, 'Your headline updated successfully.');
    } catch (error) {
        next(error);
    }
}

export async function updateArtistBioController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateBioSchema.parse(req.body);
        const result = await updateArtistBioService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(res, result, 'Your bio updated successfully.');
    } catch (error) {
        next(error);
    }
}

export async function updateArtistAddressController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateAddressSchema.parse(req.body);
        const result = await updateArtistAddressService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your address info updated successfully.'
        );
    } catch (error) {
        next(error);
    }
}

export async function updateArtistSpecialtiesController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateSpecialtiesSchema.parse(req.body);
        const result = await updateArtistSpecialtiesService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your specialties updated successfully.'
        );
    } catch (error) {
        next(error);
    }
}

export async function updateArtistMediumsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateMediumsSchema.parse(req.body);
        const result = await updateArtistMediumsService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(res, result, 'Your mediums updated successfully.');
    } catch (error) {
        next(error);
    }
}

export async function updateArtistStylesController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateStylesSchema.parse(req.body);
        const result = await updateArtistStylesService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(res, result, 'Your styles updated successfully.');
    } catch (error) {
        next(error);
    }
}

export async function updateArtistCommissionPricingController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateCommissionPricingSchema.parse(req.body);
        const result = await updateArtistCommissionPricingService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your commission pricing updated successfully.'
        );
    } catch (error) {
        next(error);
    }
}

export async function updateArtistAvailabilityStatusController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateAvailabilityStatusSchema.parse(req.body);
        const result = await updateArtistAvailabilityStatusService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your availability status updated successfully.'
        );
    } catch (error) {
        next(error);
    }
}

export async function updateArtistProfileVisibilityController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateProfileVisibilitySchema.parse(req.body);
        const result = await updateArtistProfileVisibilityService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your profile visibility option updated successfully.'
        );
    } catch (error) {
        next(error);
    }
}

export async function updateArtistSocialLinksController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateSocialLinksSchema.parse(req.body);
        const result = await updateArtistSocialLinksService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your social links updated successfully.'
        );
    } catch (error) {
        next(error);
    }
}

export async function getMyArtistProfileController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const result = await getMyArtistProfileService(req.user!.id);
        ApiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
}
