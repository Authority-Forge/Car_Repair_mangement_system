import { z } from 'zod';
import { userRoleEnum } from '../../../database/schema'; // Assuming schema export

export const RegisterSchema = z.object({
    email: z
        .string()
        .email({ message: 'Invalid email address' })
        .transform((val) => val.toLowerCase()),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password is too long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    fullName: z
        .string()
        .min(2, { message: 'Full name must be at least 2 characters' }),
    role: z.enum(['Mechanic', 'Customer'], {
        errorMap: () => ({ message: 'Role must be either Mechanic or Customer' }),
    }),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
