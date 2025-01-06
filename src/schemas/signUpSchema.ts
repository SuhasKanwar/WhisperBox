import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must not be more than 20 characters")

export const signUpScheam = z.object({
    username: usernameValidation
});