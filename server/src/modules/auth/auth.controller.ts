import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../shared/utils/appError.js';
import { ApiResponse } from '../shared/utils/response.js';

export async function getMe(req: Request, res: Response) {
    const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        include: { artistProfile: true },
    });

    if (!user) {
        throw AppError.notFound('User not found', 'USER_NOT_FOUND');
    }

    return ApiResponse.success(res, user);
}
