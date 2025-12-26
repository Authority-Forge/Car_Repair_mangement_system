import { z } from 'zod';

export const jobStatusEnum = ['In Progress', 'Waiting on Parts', 'Completed', 'Invoiced', 'Scheduled'] as const;

export const CreateJobSchema = z.object({
    vehicleId: z.number().int().positive({ message: 'Vehicle ID must be a positive integer' }),
    customerId: z.number().int().positive({ message: 'Customer ID must be a positive integer' }),
    advisorId: z.number().int().positive({ message: 'Advisor ID must be a positive integer' }),
    description: z.string().min(1, { message: 'Description is required' }),
    status: z.enum(jobStatusEnum).optional().default('Scheduled'),
});

export type CreateJobDto = z.infer<typeof CreateJobSchema>;
