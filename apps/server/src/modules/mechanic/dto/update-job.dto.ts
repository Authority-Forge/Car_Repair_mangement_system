import { z } from 'zod';
import { jobStatusEnum } from './create-job.dto';

export const UpdateJobSchema = z.object({
    status: z.enum(jobStatusEnum).optional(),
    description: z.string().optional(),
    vehicleId: z.number().int().optional(),
    customerId: z.number().int().optional(),
});

export type UpdateJobDto = z.infer<typeof UpdateJobSchema>;
