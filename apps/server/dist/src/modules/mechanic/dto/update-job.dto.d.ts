import { z } from 'zod';
export declare const UpdateJobSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["In Progress", "Waiting on Parts", "Completed", "Invoiced", "Scheduled"]>>;
    description: z.ZodOptional<z.ZodString>;
    vehicleId: z.ZodOptional<z.ZodNumber>;
    customerId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
    description?: string;
    vehicleId?: number;
    customerId?: number;
}, {
    status?: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
    description?: string;
    vehicleId?: number;
    customerId?: number;
}>;
export type UpdateJobDto = z.infer<typeof UpdateJobSchema>;
