import { AccountStatus } from '../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../shared/utils/appError.js';
import type {
    UpdateUserAvatarUrlInput,
    UpdateUserFullNameInput,
    UpdateUserInput,
} from './user.schema.js';

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

export async function updateUserFullNameService(
    userId: string,
    input: UpdateUserFullNameInput
) {
    const updatedUserFullName = await prisma.user.update({
        where: { id: userId },
        data: { fullName: input.fullName },
        select: { fullName: true },
    });

    if (!updatedUserFullName) {
        throw AppError.badRequest(
            'User full name update failed or user does not exist.',
            'USER_NOT_FOUND'
        );
    }

    return updatedUserFullName;
}

export async function updateUserAvatarService(
    userId: string,
    input: UpdateUserAvatarUrlInput
) {
    const updatedUserAvatar = await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: input.avatarUrl },
        select: { id: true, avatarUrl: true },
    });

    if (!updatedUserAvatar) {
        throw AppError.badRequest(
            'User avatar update failed or user does not exist.',
            'USER_NOT_FOUND'
        );
    }

    return updatedUserAvatar;
}

export async function deleteAccountService(userId: string) {
    const deletedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            accountStatus: AccountStatus.DELETED,
            deletedAt: new Date(),
        },
        select: {
            id: true,
            accountStatus: true,
            deletedAt: true,
        },
    });

    if (!deletedUser) {
        throw AppError.notFound(
            'Error occur during deleting your account or user does not exist. Please try again.',
            'USER_NOT_FOUND'
        );
    }

    return deletedUser;
}
