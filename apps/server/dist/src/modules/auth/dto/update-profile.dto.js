"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileSchema = void 0;
const zod_1 = require("zod");
exports.UpdateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(100).optional(),
}).strict();
//# sourceMappingURL=update-profile.dto.js.map