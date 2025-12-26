import { z } from 'zod';
export declare const jobStatusEnum: readonly ["In Progress", "Waiting on Parts", "Completed", "Invoiced", "Scheduled"];
export declare const CreateJobSchema: z.ZodObject<{
    vehicleId: z.ZodNumber;
    customerId: z.ZodNumber;
    advisorId: z.ZodNumber;
    description: z.ZodString;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<["In Progress", "Waiting on Parts", "Completed", "Invoiced", "Scheduled"]>>>;
}, "strip", z.ZodTypeAny, {
    vehicleId?: number;
    customerId?: number;
    advisorId?: number;
    description?: string;
    status?: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
}, {
    vehicleId?: number;
    customerId?: number;
    advisorId?: number;
    description?: string;
    status?: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
}>;
export type CreateJobDto = z.infer<typeof CreateJobSchema>;
