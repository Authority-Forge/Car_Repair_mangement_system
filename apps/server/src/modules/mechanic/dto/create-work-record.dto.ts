import { z } from 'zod';

export const CreateWorkRecordSchema = z.object({
    description: z.string().min(1, { message: 'Description is required' }),
    type: z.enum(['Labor', 'Part'], { errorMap: () => ({ message: 'Type must be Labor or Part' }) }),
    quantity: z.number().positive({ message: 'Quantity must be positive' }), // Decimal handled as number in JSON
    rate: z.number().min(0, { message: 'Rate must be non-negative' }),
    total: z.number().min(0, { message: 'Total must be non-negative' }),
});

export type CreateWorkRecordDto = z.infer<typeof CreateWorkRecordSchema>;
