import { z } from 'zod';

export const CreateNoteSchema = z.object({
    content: z.string().min(1, { message: 'Content cannot be empty' }).max(10000, { message: 'Note too long' }),
    type: z.enum(['Internal', 'Customer']).default('Internal'),
});

export type CreateNoteDto = z.infer<typeof CreateNoteSchema>;
