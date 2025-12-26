"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJobSchema = void 0;
const zod_1 = require("zod");
const create_job_dto_1 = require("./create-job.dto");
exports.UpdateJobSchema = zod_1.z.object({
    status: zod_1.z.enum(create_job_dto_1.jobStatusEnum).optional(),
    description: zod_1.z.string().optional(),
    vehicleId: zod_1.z.number().int().optional(),
    customerId: zod_1.z.number().int().optional(),
});
//# sourceMappingURL=update-job.dto.js.map