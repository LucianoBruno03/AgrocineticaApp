import { z } from "zod";

export const ModelsSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  active: z.boolean(),
});

export type ModelsSchemaType = z.infer<typeof ModelsSchema>;
