import { prisma } from '../../lib/prisma.js';
import { AppError } from '../shared/utils/appError.js';
import type { UpdateUserInput } from './user.schema.js';

export async function updateUserService(
    userId: string,
    input: UpdateUserInput
) {
    const { fullName, avatarUrl } = input;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, accountStatus: true },
    });

    if (!user || user.accountStatus !== 'ACTIVE') {
        throw AppError.notFound('User does not exist.', 'USER_NOT_FOUND');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { fullName, avatarUrl },
        select: { id: true, fullName: true, avatarUrl: true },
    });

    if (!updatedUser) {
        throw AppError.badRequest(
            'User update failed or user does not exist.',
            'USER_NOT_FOUND'
        );
    }

    return updatedUser;
}
