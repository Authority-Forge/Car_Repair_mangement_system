"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNoteSchema = void 0;
const zod_1 = require("zod");
exports.CreateNoteSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, { message: 'Content cannot be empty' }).max(10000, { message: 'Note too long' }),
    type: zod_1.z.enum(['Internal', 'Customer']).default('Internal'),
});
//# sourceMappingURL=create-note.dto.js.map