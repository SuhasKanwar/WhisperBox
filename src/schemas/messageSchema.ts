import { z } from 'zod';

export const messageSchema = z.object({
    content: z
        .string()
        .min(1, {message: "message content is required"})
        .max(500, {message: "message must not be more than 500 characters"})
});