"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetSchema = exports.PasswordResetRequestSchema = void 0;
const zod_1 = require("zod");
exports.PasswordResetRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
}).strict();
exports.PasswordResetSchema = zod_1.z.object({
    token: zod_1.z.string().min(10),
    password: zod_1.z.string().min(8).regex(/[0-9]/, "Password must contain a number").regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
}).strict();
//# sourceMappingURL=password-reset.dto.js.map