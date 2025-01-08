import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email invalido").min(1, "El email es requerido"),
  dni: z.string().min(1, "El dni es requerido"),
});
