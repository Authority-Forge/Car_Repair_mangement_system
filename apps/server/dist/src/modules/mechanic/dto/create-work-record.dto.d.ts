import { z } from 'zod';
export declare const CreateWorkRecordSchema: z.ZodObject<{
    description: z.ZodString;
    type: z.ZodEnum<["Labor", "Part"]>;
    quantity: z.ZodNumber;
    rate: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    description?: string;
    type?: "Labor" | "Part";
    quantity?: number;
    rate?: number;
    total?: number;
}, {
    description?: string;
    type?: "Labor" | "Part";
    quantity?: number;
    rate?: number;
    total?: number;
}>;
export type CreateWorkRecordDto = z.infer<typeof CreateWorkRecordSchema>;
