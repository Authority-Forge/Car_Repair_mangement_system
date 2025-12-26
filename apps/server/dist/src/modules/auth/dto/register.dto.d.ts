import { z } from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
    fullName: z.ZodString;
    role: z.ZodEnum<["Mechanic", "Customer"]>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    role?: "Mechanic" | "Customer";
    fullName?: string;
    password?: string;
}, {
    email?: string;
    role?: "Mechanic" | "Customer";
    fullName?: string;
    password?: string;
}>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
