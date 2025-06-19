import { z } from "zod";

export const BrandSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  active: z.boolean(),
});

export type BrandSchemaType = z.infer<typeof BrandSchema>;
