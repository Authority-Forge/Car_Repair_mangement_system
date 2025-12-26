import { z } from 'zod';

export const UpdateProfileSchema = z.object({
    fullName: z.string().min(2).max(100).optional(),
    // Allow other profile fields here as needed
}).strict();

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
