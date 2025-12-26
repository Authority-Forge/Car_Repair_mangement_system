"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWorkRecordSchema = void 0;
const zod_1 = require("zod");
exports.CreateWorkRecordSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, { message: 'Description is required' }),
    type: zod_1.z.enum(['Labor', 'Part'], { errorMap: () => ({ message: 'Type must be Labor or Part' }) }),
    quantity: zod_1.z.number().positive({ message: 'Quantity must be positive' }),
    rate: zod_1.z.number().min(0, { message: 'Rate must be non-negative' }),
    total: zod_1.z.number().min(0, { message: 'Total must be non-negative' }),
});
//# sourceMappingURL=create-work-record.dto.js.map