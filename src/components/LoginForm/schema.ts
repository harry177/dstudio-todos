import { z } from "zod";
import { EmailSchema, PasswordSchema } from "../../validation/schemas";

export const LoginFormSchema = z.object({
  nameLabel: EmailSchema,
  passwordLabel: PasswordSchema,
});

export type TLoginFormSchema = z.infer<typeof LoginFormSchema>;