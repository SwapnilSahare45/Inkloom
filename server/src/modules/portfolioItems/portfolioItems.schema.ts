import z from 'zod';
import { MediaRole } from '../../generated/prisma/enums.js';

const currentYear = new Date().getFullYear();

const BaseTitle = z
    .string()
    .trim()
    .min(1, { message: 'Title is required.' })
    .max(160, { message: 'Title must be 160 characters or fewer.' });

const BaseDescription = z
    .string()
    .trim()
    .min(1, { message: 'Description is required.' });

const BaseArtType = z
    .string()
    .trim()
    .min(1, { message: 'Art type is required.' })
    .max(50, { message: 'Art type must be 50 characters or fewer.' });

const BaseMedium = z
    .string()
    .trim()
    .min(1, { message: 'Medium is required.' })
    .max(80, { message: 'Medium must be 80 characters or fewer.' });

const BaseSubject = z
    .string()
    .trim()
    .min(1, { message: 'Subject is required.' })
    .max(80, { message: 'Subject must be 80 characters or fewer.' });

const BaseStyle = z
    .string()
    .trim()
    .min(1, { message: 'Style is required.' })
    .max(80, { message: 'Style must be 80 characters or fewer.' });

const BaseYearCreated = z
    .number()
    .int()
    .min(1000, { message: 'Year must be a 4-digit number.' })
    .max(currentYear, { message: 'Year cannot be in the future.' });

const BaseDimensionsText = z
    .string()
    .trim()
    .min(1, { message: 'Dimensions is required.' })
    .max(80, { message: 'Dimensions must be 80 characters or fewer.' });

const BaseIsOriginal = z.boolean().default(true);

const BasePortfolioMedia = z.object({
    url: z
        .string()
        .trim()
        .pipe(z.url({ message: 'Invalid URL.' })),
    mediaRole: z.enum(MediaRole).default('PRIMARY'),
    altText: z
        .string()
        .trim()
        .max(220, { message: 'Alt text must be 220 characters or fewer.' })
        .nullable()
        .optional(),
});

export const CreatePortfolioItemSchema = z.object({
    title: BaseTitle,
    description: BaseDescription.nullable().optional(),
    artType: BaseArtType,
    medium: BaseMedium,
    subject: BaseSubject.nullable().optional(),
    style: BaseStyle.nullable().optional(),
    yearCreated: BaseYearCreated.nullable().optional(),
    dimensionsText: BaseDimensionsText.nullable().optional(),
    isOriginal: BaseIsOriginal,
    portfolioMedia: z.array(BasePortfolioMedia),
});
export type CreatePortfolioItemInput = z.infer<
    typeof CreatePortfolioItemSchema
>;

export const UpdatePortfolioItemSchema = CreatePortfolioItemSchema.omit({
    portfolioMedia: true,
}).partial();
export type UpdatePortfolioItemInput = z.infer<
    typeof UpdatePortfolioItemSchema
>;
