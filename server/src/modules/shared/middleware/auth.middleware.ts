import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma.js';

// TODO: Update for production
export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (
        process.env.NODE_ENV === 'development' &&
        req.headers['x-dev-user-id']
    ) {
        const devUserId = req.headers['x-dev-user-id'] as string;

        const user = await prisma.user.findUnique({
            where: { id: devUserId },
            select: {
                id: true,
                isArtist: true,
            },
        });

        if (user) {
            req.user = user;
            return next();
        }
    }
}
