import { z } from 'zod';

export const LoginSchema = z.object({
    email: z
        .string()
        .email({ message: 'Invalid email address' })
        .transform((val) => val.toLowerCase()),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password is too long' }),
    role: z.enum(['Mechanic', 'Customer'], {
        errorMap: () => ({ message: 'Role must be either Mechanic or Customer' }),
    }),
});

export type LoginDto = z.infer<typeof LoginSchema>;
