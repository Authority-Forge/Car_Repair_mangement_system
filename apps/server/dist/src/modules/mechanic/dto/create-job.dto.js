"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobSchema = exports.jobStatusEnum = void 0;
const zod_1 = require("zod");
exports.jobStatusEnum = ['In Progress', 'Waiting on Parts', 'Completed', 'Invoiced', 'Scheduled'];
exports.CreateJobSchema = zod_1.z.object({
    vehicleId: zod_1.z.number().int().positive({ message: 'Vehicle ID must be a positive integer' }),
    customerId: zod_1.z.number().int().positive({ message: 'Customer ID must be a positive integer' }),
    advisorId: zod_1.z.number().int().positive({ message: 'Advisor ID must be a positive integer' }),
    description: zod_1.z.string().min(1, { message: 'Description is required' }),
    status: zod_1.z.enum(exports.jobStatusEnum).optional().default('Scheduled'),
});
//# sourceMappingURL=create-job.dto.js.map