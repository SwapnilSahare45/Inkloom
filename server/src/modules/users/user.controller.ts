import type { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../shared/utils/response.js';
import {
    UpdateUserAvatarUrlSchema,
    UpdateUserFullNameSchema,
    UpdateUserSchema,
} from './user.schema.js';
import {
    deleteAccountService,
    updateUserAvatarService,
    updateUserFullNameService,
    updateUserService,
} from './user.service.js';

export async function updateUserController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateUserSchema.parse(req.body);
        const result = await updateUserService(req.user!.id, validatedInput);
        ApiResponse.success(
            res,
            result,
            'Your full name and avatar updated successfully.'
        );
    } catch (error) {
        next(error);
    }
}

export async function updateUserFullNameController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateUserFullNameSchema.parse(req.body);
        const result = await updateUserFullNameService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your full name updated successfully.'
        );
    } catch (error) {
        next(error);
    }
}

export async function updateUserAvatarController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validatedInput = UpdateUserAvatarUrlSchema.parse(req.body);
        const result = await updateUserAvatarService(
            req.user!.id,
            validatedInput
        );
        ApiResponse.success(res, result, 'Your avatar updated successfully.');
    } catch (error) {
        next(error);
    }
}

export async function deleteAccountController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const result = await deleteAccountService(req.user!.id);
        ApiResponse.success(
            res,
            result,
            'Your account deletion request has been processed successfully.'
        );
    } catch (error) {
        next(error);
    }
}
