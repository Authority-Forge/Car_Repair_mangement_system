import { z } from 'zod';
export declare const UpdateProfileSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    fullName?: string;
}, {
    fullName?: string;
}>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
