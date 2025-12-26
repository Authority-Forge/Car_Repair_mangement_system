import { z } from 'zod';

export const PasswordResetRequestSchema = z.object({
    email: z.string().email(),
}).strict();

export type PasswordResetRequestDto = z.infer<typeof PasswordResetRequestSchema>;

export const PasswordResetSchema = z.object({
    token: z.string().min(10),
    password: z.string().min(8).regex(/[0-9]/, "Password must contain a number").regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
}).strict();

export type PasswordResetDto = z.infer<typeof PasswordResetSchema>;
