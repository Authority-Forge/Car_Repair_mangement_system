import { z } from 'zod';
export declare const PasswordResetRequestSchema: z.ZodObject<{
    email: z.ZodString;
}, "strict", z.ZodTypeAny, {
    email?: string;
}, {
    email?: string;
}>;
export type PasswordResetRequestDto = z.infer<typeof PasswordResetRequestSchema>;
export declare const PasswordResetSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, "strict", z.ZodTypeAny, {
    token?: string;
    password?: string;
}, {
    token?: string;
    password?: string;
}>;
export type PasswordResetDto = z.infer<typeof PasswordResetSchema>;
