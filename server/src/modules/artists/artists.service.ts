import type { Prisma } from '../../generated/prisma/client.js';
import type { AvailabilityStatus } from '../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../shared/utils/appError.js';
import type {
    CreateArtistProfileInput,
    UpdateAddressInput,
    UpdateAvailabilityStatusInput,
    UpdateBioInput,
    UpdateCommissionPricingInput,
    UpdateDisplayNameInput,
    UpdateHeadlineInput,
    UpdateMediumsInput,
    UpdateSpecialtiesInput,
    UpdateStylesInput,
} from './artists.schema.js';

interface SearchQuery {
    specialty?: string;
    medium?: string;
    style?: string;
    budget?: number;
    availability?: AvailabilityStatus;
    verified?: boolean;
    sort?: 'asc' | 'desc' | 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}

export async function getAllArtistsService(query: SearchQuery = {}) {
    const {
        specialty,
        medium,
        style,
        budget,
        availability,
        verified,
        sort = 'asc',
        page = 1,
        limit = 20,
    } = query;

    const where: Prisma.ArtistProfileWhereInput = {
        // only show active user
        user: { accountStatus: 'ACTIVE' },
        // only return publicly visible profile
        profileVisibility: 'PUBLIC',
    };

    // Array filters
    if (specialty) where.specialties = { has: specialty };
    if (medium) where.mediums = { has: medium };
    if (style) where.styles = { has: style };

    // Budget filter
    if (budget !== undefined) {
        where.AND = [
            {
                OR: [
                    { commissionMinAmount: null },
                    { commissionMinAmount: { lte: budget } },
                ],
            },
            {
                OR: [
                    { commissionMaxAmount: null },
                    { commissionMaxAmount: { gte: budget } },
                ],
            },
        ];
    }

    // Availability status filter
    if (availability) {
        where.availabilityStatus = availability;
    }

    // Verification filter
    if (verified !== undefined) {
        where.verificationStatus = verified
            ? { in: ['IDENTITY_VERIFIED', 'VIDEO_VERIFIED'] }
            : 'UNVERIFIED';
    }

    const sortOrder = sort.toLowerCase() as 'asc' | 'desc';
    const skip = (Math.max(1, page) - 1) * limit;

    const [artists, total] = await Promise.all([
        prisma.artistProfile.findMany({
            where,
            select: {
                id: true,
                displayName: true,
                headline: true,
                bio: true,
                countryCode: true,
                specialties: true,
                mediums: true,
                styles: true,
                commissionMinAmount: true,
                commissionMaxAmount: true,
                currency: true,
                availabilityStatus: true,
                responseTimeHours: true,
                verificationStatus: true,
                socialLinks: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { createdAt: sortOrder },
            skip,
            take: limit,
        }),
        prisma.artistProfile.count({ where }),
    ]);

    return {
        artists,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getArtistByIdService(artistId: string) {
    const artist = await prisma.artistProfile.findUnique({
        where: {
            id: artistId,
            AND: [
                {
                    OR: [
                        { verificationStatus: 'IDENTITY_VERIFIED' },
                        { verificationStatus: 'VIDEO_VERIFIED' },
                    ],
                },
                { profileVisibility: 'PUBLIC' },
            ],
        },
        omit: { createdAt: true, updatedAt: true },
        include: {
            user: {
                select: {
                    id: true,
                    avatarUrl: true,
                },
            },
        },
    });

    if (!artist) {
        throw AppError.notFound(
            'Artist does not verified yet or artist does not exist.',
            'ARTIST_NOT_FOUND'
        );
    }

    return artist;
}

export async function createArtistProfileService(
    userId: string,
    input: CreateArtistProfileInput
) {
    const existingArtistProfile = await prisma.artistProfile.findUnique({
        where: { userId },
    });

    if (existingArtistProfile) {
        throw AppError.conflict(
            'Your profile already exists.',
            'PROFILE_EXISTS'
        );
    }

    const createdProfile = await prisma.artistProfile.create({
        data: {
            userId,
            ...input,
        },
        include: {
            user: {
                select: {
                    id: true,
                    avatarUrl: true,
                    fullName: true,
                },
            },
        },
    });

    if (!createdProfile) {
        throw AppError.badRequest(
            'Facing an error while creating profile. Please try again.',
            'ERROR_WHILE_CREATING_PROFILE'
        );
    }

    return createdProfile;
}

export async function updateArtistDisplayNameService(
    userId: string,
    { displayName }: UpdateDisplayNameInput
) {
    const updatedArtistProfile = await prisma.artistProfile.update({
        where: { userId },
        data: { displayName },
        select: { id: true, displayName: true },
    });

    if (!updatedArtistProfile) {
        throw AppError.notFound(
            'Your artist profile does not exist.',
            'ARTIST_NOT_FOUND'
        );
    }

    return updatedArtistProfile;
}

export async function updateArtistHeadlineService(
    userId: string,
    { headline }: UpdateHeadlineInput
) {
    const updatedArtistProfile = await prisma.artistProfile.update({
        where: { userId },
        data: { headline },
        select: { id: true, headline: true },
    });

    if (!updatedArtistProfile) {
        throw AppError.notFound(
            'Your artist profile does not exist.',
            'ARTIST_NOT_FOUND'
        );
    }

    return updatedArtistProfile;
}

export async function updateArtistBioService(
    userId: string,
    { bio }: UpdateBioInput
) {
    const updatedArtistProfile = await prisma.artistProfile.update({
        where: { userId },
        data: { bio },
        select: { id: true, bio: true },
    });

    if (!updatedArtistProfile) {
        throw AppError.notFound(
            'Your artist profile does not exist.',
            'ARTIST_NOT_FOUND'
        );
    }

    return updatedArtistProfile;
}

export async function updateArtistAddressService(
    userId: string,
    input: UpdateAddressInput
) {
    const updatedAddress = await prisma.artistProfile.update({
        where: { userId },
        data: { ...input },

        select: {
            id: true,
            locationCity: true,
            locationState: true,
            countryCode: true,
        },
    });

    if (!updatedAddress) {
        throw AppError.notFound(
            'Your artist profile does not exist.',
            'ARTIST_NOT_FOUND'
        );
    }

    return updatedAddress;
}

export async function updateArtistSpecialtiesService(
    userId: string,
    input: UpdateSpecialtiesInput
) {
    const updatedArtistProfile = await prisma.artistProfile.update({
        where: { userId },
        data: { specialties: input.specialties },
        select: {
            id: true,
            specialties: true,
        },
    });

    if (!updatedArtistProfile) {
        throw AppError.notFound(
            'Your artist profile does not exist.',
            'ARTIST_NOT_FOUND'
        );
    }

    return updatedArtistProfile;
}

export async function updateArtistMediumsService(
    userId: string,
    input: UpdateMediumsInput
) {
    const updatedArtistProfile = await prisma.artistProfile.update({
        where: { userId },
        data: { mediums: input.mediums },
        select: {
            id: true,
            mediums: true,
        },
    });

    if (!updatedArtistProfile) {
        throw AppError.notFound(
            'Your artist profile does not exist.',
            'ARTIST_NOT_FOUND'
        );
    }

    return updatedArtistProfile;
}

export async function updateArtistStylesService(
    userId: string,
    input: UpdateStylesInput
) {
    const updatedArtistProfile = await prisma.artistProfile.update({
        where: { userId },
        data: { styles: input.styles },
        select: { id: true, styles: true },
    });

    if (!updatedArtistProfile) {
        throw AppError.notFound(
            'Your artist profile does not exist.',
            'ARTIST_NOT_FOUND'
        );
    }

    return updatedArtistProfile;
}

export async function updateArtistCommissionPricingService(
    userId: string,
    input: UpdateCommissionPricingInput
) {
    const updatedArtistProfile = await prisma.artistProfile.update({
        where: { userId },
        data: {
            commissionMinAmount: input.commissionMinAmount,
            commissionMaxAmount: input.commissionMaxAmount,
            currency: input.currency,
        },
        select: {
            id: true,
            commissionMinAmount: true,
            commissionMaxAmount: true,
            currency: true,
        },
    });

    if (!updatedArtistProfile) {
        throw AppError.notFound(
            'Your artist profile does not exist.',
            'ARTIST_NOT_FOUND'
        );
    }

    return updatedArtistProfile;
}

export async function updateArtistAvailabilityStatusService(
    userId: string,
    input: UpdateAvailabilityStatusInput
) {
    const updatedArtistProfile = await prisma.artistProfile.update({
        where: { userId },
        data: { availabilityStatus: input.availabilityStatus },
        select: {
            id: true,
            availabilityStatus: true,
        },
    });

    if (!updatedArtistProfile) {
        throw AppError.notFound(
            'Your artist profile does not exist.',
            'ARTIST_NOT_FOUND'
        );
    }

    return updatedArtistProfile;
}
