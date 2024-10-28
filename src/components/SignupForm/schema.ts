import { z } from "zod";
import { EmailSchema, PasswordSchema, RepeatPasswordSchema } from "../../validation/schemas";

export const SignupFormSchema = z.object({
  emailLabel: EmailSchema,
  passwordLabel: PasswordSchema,
  repeatLabel: RepeatPasswordSchema,
}).superRefine(({ repeatLabel, passwordLabel }, ctx) => {
    if (repeatLabel !== passwordLabel) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['repeatLabel']
      });
    }
  });;

export type TSignupFormSchema = z.infer<typeof SignupFormSchema>;