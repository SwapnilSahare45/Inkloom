import z from 'zod';

const BaseUserShape = z.object({
    fullName: z
        .string()
        .trim()
        .max(120, { message: 'Full name must be 100 characters or fewer.' }),
    avatarUrl: z
        .string()
        .trim()
        .max(500, { message: 'Avatar url must be 500 characters or fewer.' })
        .pipe(z.url({ message: 'Invalid avatar url.' }))
        .nullable()
        .optional(),
});

export const UpdateUserSchema = BaseUserShape;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const UpdateUserFullNameSchema = BaseUserShape.pick({ fullName: true });
export type UpdateUserFullNameInput = z.infer<typeof UpdateUserFullNameSchema>;

export const UpdateUserAvatarUrlSchema = BaseUserShape.pick({
    avatarUrl: true,
});
export type UpdateUserAvatarUrlInput = z.infer<
    typeof UpdateUserAvatarUrlSchema
>;
