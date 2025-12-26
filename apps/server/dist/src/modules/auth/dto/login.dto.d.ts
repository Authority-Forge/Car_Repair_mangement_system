import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
    role: z.ZodEnum<["Mechanic", "Customer"]>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
    role?: "Mechanic" | "Customer";
}, {
    email?: string;
    password?: string;
    role?: "Mechanic" | "Customer";
}>;
export type LoginDto = z.infer<typeof LoginSchema>;
