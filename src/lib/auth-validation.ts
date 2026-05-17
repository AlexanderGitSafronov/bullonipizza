import { z } from "zod";
import { sanitize } from "./validation";

export const registerSchema = z.object({
  email: z
    .string()
    .transform((v) => sanitize(v).toLowerCase())
    .pipe(z.string().email().max(120)),
  password: z
    .string()
    .min(8, "min")
    .max(72, "max"),
  name: z
    .string()
    .transform(sanitize)
    .pipe(z.string().min(2).max(60))
    .optional()
    .or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "consent" }),
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .transform((v) => sanitize(v).toLowerCase())
    .pipe(z.string().email().max(120)),
  password: z.string().min(1).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
