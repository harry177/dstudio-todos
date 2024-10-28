import { z } from "zod";

export const EmailSchema = z
  .string()
  .min(5, "Email wrong format")
  .max(50, "Email wrong format")
  .includes("@", { message: "Email wrong format. Try adding a '@' symbol" })
  .includes(".", { message: "Email wrong format. Try adding a '.' symbol" })
  .regex(/^[a-zA-Z\d._-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Email wrong format")
  .regex(/^(?!.*[+~]{2}).+$/, "Email wrong format");

export const PasswordSchema = z
  .string()
  .min(8, "Should be between 8 and 20 characters")
  .max(20, "Should be between 8 and 20 characters")
  .regex(/[a-z]/, "Should have at least 1 lowercase Latin letter")
  .regex(/[A-Z]/, "Should have at least 1 uppercase Latin letter")
  .regex(/[0-9]/, "Should have at least 1 number from 0 to 9")
  .regex(
    /[!@#$?*()[\]{}'";:\\/<>,_.-]/,
    "Should have at least 1 special character"
  );

export const RepeatPasswordSchema = z.lazy(() =>
  z
    .string()
    .min(3, "Password must be at least 3 characters long")
    .max(20, "Password must be at most 20 characters long")
);

export const TitleSchema = z
  .string()
  .min(1, "This field is required")
  .max(50, "Title must be at most 40 characters long");

export const DescriptionSchema = z
  .string()
  .min(1, "This field is required")
  .max(150, "Description must be at most 150 characters long");

export const DueDateSchema = z
  .union([z.date(), z.string().transform((val) => new Date(val))])
  .refine((date) => date >= new Date(0, 0, 0, 0, 0, 0, 0), {
    message: "Due date must not be in the past",
  })
  .refine(
    (date) =>
      date >= new Date(0, 0, 0, 0, 0, 0, 0) && date <= new Date(2099, 11, 31),
    {
      message: "Due date must be until 31.12.2099",
    }
  );

export const IsCompletedSchema = z.boolean().optional();
