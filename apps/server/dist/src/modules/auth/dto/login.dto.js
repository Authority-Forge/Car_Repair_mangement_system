"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = void 0;
const zod_1 = require("zod");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: 'Invalid email address' })
        .transform((val) => val.toLowerCase()),
    password: zod_1.z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password is too long' }),
    role: zod_1.z.enum(['Mechanic', 'Customer'], {
        errorMap: () => ({ message: 'Role must be either Mechanic or Customer' }),
    }),
});
//# sourceMappingURL=login.dto.js.map