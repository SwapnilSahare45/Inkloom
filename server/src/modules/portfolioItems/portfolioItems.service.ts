import { prisma } from '../../lib/prisma.js';
import { AppError } from '../shared/utils/appError.js';
import type {
    CreatePortfolioItemInput,
    UpdatePortfolioItemInput,
} from './portfolioItems.schema.js';

interface GetPortfolioArgs {
    artistId: string;
    limit?: number;
    cursor?: string;
}

export async function getMyPortfolioItemsService({
    artistId,
    limit = 10,
    cursor,
}: GetPortfolioArgs) {
    const portfolioItems = await prisma.portfolioItem.findMany({
        take: limit + 1,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        where: { artistProfileId: artistId },
        orderBy: {
            id: 'desc',
        },
    });

    let nextCursor: string | undefined = undefined;

    if (portfolioItems.length > limit) {
        const nextItem = portfolioItems.pop();
        nextCursor = nextItem?.id;
    }
    return { portfolioItems, nextCursor };
}

export async function getMyPortfolioItemService(
    artistId: string,
    itemId: string
) {
    const portfolioItem = await prisma.portfolioItem.findUnique({
        where: { id: itemId, artistProfileId: artistId },
        include: {
            artist: {
                select: {
                    id: true,
                    displayName: true,
                    headline: true,
                },
            },
        },
    });

    if (!portfolioItem) {
        throw AppError.notFound(
            'Portfolio item does not exist.',
            'PORTFOLIO_ITEM_NOT_FOUND'
        );
    }

    return portfolioItem;
}

export async function createPortfolioItemService(
    artistId: string,
    input: CreatePortfolioItemInput
) {
    const artist = await prisma.artistProfile.findUnique({
        where: {
            id: artistId,
            OR: [
                { verificationStatus: 'IDENTITY_VERIFIED' },
                { verificationStatus: 'VIDEO_VERIFIED' },
            ],
        },
        select: {
            id: true,
        },
    });

    if (!artist) {
        throw AppError.notFound(
            'Your artist profile does not exist or profile not verified.',
            'ARTIST_NOT_FOUND'
        );
    }

    const createdItem = await prisma.portfolioItem.create({
        data: {
            artistProfileId: artistId,
            ...input,
        },
    });

    if (!createdItem) {
        throw AppError.badRequest(
            'Error occur while creating portfolio item. Please try again.',
            'PORTFOLIO_ITEM_NOT_CREATED'
        );
    }

    return createdItem;
}

export async function updatePortfolioItemService(
    artistId: string,
    itemId: string,
    input: UpdatePortfolioItemInput
) {
    const updatedItem = await prisma.portfolioItem.update({
        where: {
            id: itemId,
            artistProfileId: artistId,
        },
        data: {
            ...input,
        },
    });

    if (!updatedItem) {
        throw AppError.notFound(
            'Portfolio item does not exist.',
            'PORTFOLIO_ITEM_NOT_FOUND'
        );
    }

    return updatedItem;
}

export async function deletePortfolioItemService(
    artistId: string,
    itemId: string
) {
    const deletedItem = await prisma.portfolioItem.delete({
        where: {
            id: itemId,
            artistProfileId: artistId,
        },
        select: {
            id: true,
        },
    });

    if (!deletedItem) {
        throw AppError.notFound(
            'Error occur while deleting portfolio item. Please try again.',
            'PORTFOLIO_ITEM_NOT_DELETED'
        );
    }

    return deletedItem;
}
