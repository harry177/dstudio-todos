import { z } from 'zod';
import { DescriptionSchema, DueDateSchema, IsCompletedSchema, TitleSchema } from '../../validation/schemas';

export const TodoFormSchema = z.object({
    title: TitleSchema,
    description: DescriptionSchema,
    dueDate: DueDateSchema,
    isCompleted: IsCompletedSchema,
});

export type TTodoFormSchema = z.infer<typeof TodoFormSchema>;