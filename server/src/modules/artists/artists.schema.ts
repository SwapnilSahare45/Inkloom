import z from 'zod';
import {
    AvailabilityStatus,
    ProfileVisibility,
} from '../../generated/prisma/enums.js';

const BaseDisplayName = z
    .string()
    .trim()
    .min(1, { message: 'Display name is required.' })
    .max(120, {
        message: 'Display name must be 120 characters or fewer.',
    });

const BaseHeadline = z
    .string()
    .trim()
    .min(1, { message: 'Headline is required.' })
    .max(180, { message: 'Headline must be 180 characters or fewer.' });

const BaseBio = z.string().trim().min(1, { message: 'Bio is required.' });

const BaseLocationCity = z
    .string()
    .trim()
    .min(1, { message: 'City is required.' })
    .max(100, { message: 'City must be 100 characters or fewer.' });

const BaseLocationState = z
    .string()
    .trim()
    .min(1, { message: 'State is required.' })
    .max(100, { message: 'State must be 100 characters or fewer.' });

const BaseCountryCode = z
    .string()
    .trim()
    .length(2, { message: 'Country code must be a 2-letter ISO code.' })
    .toUpperCase();

const BaseCommissionMinAmount = z
    .number()
    .positive({ message: 'Minimum amount must be greater than 0.' });

const BaseCommissionMaxAmount = z
    .number()
    .positive({ message: 'Maximum amount must be greater than 0.' });

const BaseCurrency = z
    .string()
    .trim()
    .length(3, { message: 'Currency must be a 3-letter ISO code.' })
    .toUpperCase()
    .default('INR');

const BaseAvailabilityStatus = z
    .enum(AvailabilityStatus)
    .default(AvailabilityStatus.AVAILABLE);

const BaseProfileVisibility = z
    .enum(ProfileVisibility)
    .default(ProfileVisibility.PUBLIC);

const BaseSocialLinks = z.object({
    instagram: z
        .string()
        .trim()
        .pipe(z.url({ message: 'Invalid instagram url' }))
        .optional()
        .or(z.literal('')),
    x: z
        .string()
        .trim()
        .pipe(z.url({ message: 'Invalid X url' }))
        .optional()
        .or(z.literal('')),
    website: z
        .string()
        .trim()
        .pipe(z.url({ message: 'Invalid website url' }))
        .optional()
        .or(z.literal('')),
    linkedin: z
        .string()
        .trim()
        .pipe(z.url('Invalid linkedin url'))
        .optional()
        .or(z.literal('')),
});

export const CreateArtistProfileSchema = z
    .object({
        displayName: BaseDisplayName,
        headline: BaseHeadline.nullable().optional(),
        bio: BaseBio.nullable().optional(),
        locationCity: BaseLocationCity.nullable().optional(),
        locationState: BaseLocationState.nullable().optional(),
        countryCode: BaseCountryCode,
        specialties: z.array(z.string().trim()).default([]),
        mediums: z.array(z.string().trim()).default([]),
        styles: z.array(z.string().trim()).default([]),
        commissionMinAmount: BaseCommissionMinAmount.nullable().optional(),
        commissionMaxAmount: BaseCommissionMaxAmount.nullable().optional(),
        currency: BaseCurrency,
        availabilityStatus: BaseAvailabilityStatus,
        profileVisibility: BaseProfileVisibility,
        socialLinks: BaseSocialLinks.default({}),
    })
    .refine(
        (data) => {
            if (
                data.commissionMinAmount !== null &&
                data.commissionMaxAmount !== null &&
                data.commissionMinAmount !== undefined &&
                data.commissionMaxAmount !== undefined
            ) {
                return data.commissionMaxAmount >= data.commissionMinAmount;
            }
            return true;
        },
        {
            message:
                'Maximum commission amount must be greater than or equal to minimum amount.',
            path: ['commissionMaxAmount'],
        }
    );
export type CreateArtistProfileInput = z.infer<
    typeof CreateArtistProfileSchema
>;

export const UpdateDisplayNameSchema = z.object({
    displayName: BaseDisplayName,
});
export type UpdateDisplayNameInput = z.infer<typeof UpdateDisplayNameSchema>;

export const UpdateHeadlineSchema = z.object({
    headline: BaseHeadline,
});
export type UpdateHeadlineInput = z.infer<typeof UpdateHeadlineSchema>;

export const UpdateBioSchema = z.object({
    bio: BaseBio,
});
export type UpdateBioInput = z.infer<typeof UpdateBioSchema>;

export const UpdateAddressSchema = z.object({
    locationCity: BaseLocationCity,
    locationState: BaseLocationState,
    countryCode: BaseCountryCode,
});
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;

export const UpdateSpecialtiesSchema = z.object({
    specialties: z
        .array(z.string().trim().min(1, 'Specialty cannot be empty.'))
        .min(1, 'At least one specialty is required.'),
});
export type UpdateSpecialtiesInput = z.infer<typeof UpdateSpecialtiesSchema>;

export const UpdateMediumsSchema = z.object({
    mediums: z
        .array(z.string().trim().min(1, 'Medium cannot be empty.'))
        .min(1, 'At least one medium is required.'),
});
export type UpdateMediumsInput = z.infer<typeof UpdateMediumsSchema>;

export const UpdateStylesSchema = z.object({
    styles: z
        .array(z.string().trim().min(1, 'Style cannot be empty.'))
        .min(1, 'At least one style is required.'),
});
export type UpdateStylesInput = z.infer<typeof UpdateStylesSchema>;

export const UpdateCommissionPricingSchema = z
    .object({
        commissionMinAmount: BaseCommissionMinAmount,
        commissionMaxAmount: BaseCommissionMaxAmount,
        currency: BaseCurrency,
    })
    .refine((data) => data.commissionMaxAmount >= data.commissionMinAmount, {
        message:
            'Maximum commission amount must be greater than or equal to minimum amount',
        path: ['commissionMaxAmount'],
    });
export type UpdateCommissionPricingInput = z.infer<
    typeof UpdateCommissionPricingSchema
>;

export const UpdateAvailabilityStatusSchema = z.object({
    availabilityStatus: BaseAvailabilityStatus,
});
export type UpdateAvailabilityStatusInput = z.infer<
    typeof UpdateAvailabilityStatusSchema
>;

export const UpdateProfileVisibilitySchema = z.object({
    profileVisibility: BaseProfileVisibility,
});
export type UpdateProfileVisibilityInput = z.infer<
    typeof UpdateProfileVisibilitySchema
>;

export const UpdateSocialLinksSchema = z.object({
    socialLinks: BaseSocialLinks,
});
export type UpdateSocialLinksInput = z.infer<typeof UpdateSocialLinksSchema>;
