import { z } from "zod";
import { sanitize } from "./validation";

const localized = (max: number) =>
  z.string().transform(sanitize).pipe(z.string().min(1).max(max));

export const productCreateSchema = z.object({
  slug: z
    .string()
    .transform((v) => sanitize(v).toLowerCase())
    .pipe(
      z
        .string()
        .min(2)
        .max(64)
        .regex(/^[a-z0-9-]+$/, { message: "slug" })
    ),
  nameUk: localized(120),
  nameEn: localized(120),
  nameRu: localized(120),
  descUk: localized(500),
  descEn: localized(500),
  descRu: localized(500),
  image: z.string().url().max(500),
  basePrice: z.number().min(0).max(100_000),
  categoryId: z.string().min(1).max(64),
  isPopular: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  hasSize: z.boolean().default(true),
  hasCrust: z.boolean().default(true),
  discount: z.number().int().min(0).max(95).default(0),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
