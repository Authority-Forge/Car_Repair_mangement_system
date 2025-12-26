"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: 'Invalid email address' })
        .transform((val) => val.toLowerCase()),
    password: zod_1.z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password is too long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    fullName: zod_1.z
        .string()
        .min(2, { message: 'Full name must be at least 2 characters' }),
    role: zod_1.z.enum(['Mechanic', 'Customer'], {
        errorMap: () => ({ message: 'Role must be either Mechanic or Customer' }),
    }),
});
//# sourceMappingURL=register.dto.js.map