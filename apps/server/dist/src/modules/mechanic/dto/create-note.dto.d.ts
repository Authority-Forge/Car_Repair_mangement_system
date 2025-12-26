import { z } from 'zod';
export declare const CreateNoteSchema: z.ZodObject<{
    content: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["Internal", "Customer"]>>;
}, "strip", z.ZodTypeAny, {
    content?: string;
    type?: "Internal" | "Customer";
}, {
    content?: string;
    type?: "Internal" | "Customer";
}>;
export type CreateNoteDto = z.infer<typeof CreateNoteSchema>;
