import type { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../shared/utils/response.js';
import { UpdateUserSchema } from './user.schema.js';
import { updateUserService } from './user.service.js';

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
            'Your profile updated successfully.full name and avatar updated successfully'
        );
    } catch (error) {
        next(error);
    }
}
