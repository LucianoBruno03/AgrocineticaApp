import { z } from "zod";

export const RegisterSchema = z.object({
  isUser: z.boolean(),
  roleName: z.string(),
  categoryTypeId: z.string(),
  countryId: z.string(),
  provinceId: z.string(),
  locationId: z.string(),
  eRoleId: z.string(),
  email: z
    .string()
    .email("El email no es válido")
    .max(40, "Debe tener 40 caracteres o menos")
    .nonempty("El email es requerido"),
  businessName: z
    .string()
    .max(40, "Debe tener 40 caracteres o menos")
    .nonempty("La razón social es obligatoria"),
  tradeName: z
    .string()
    .max(40, "Debe tener 40 caracteres o menos")
    .nonempty("El nombre de fantasía es obligatorio"),
  cuit: z
    .string()
    .nonempty("El CUIT es requerido")
    .min(11, "El CUIT debe tener 11 caracteres")
    .max(11, "El CUIT debe tener 11 caracteres"),
  phone: z
    .string()
    // .regex(
    //   /^\+[0-9]{2} [0-9] [0-9]{4} [0-9]{2}-[0-9]{4}$/,
    //   "Teléfono inválido"
    // )
    .nonempty("El teléfono es obligatorio"),
  address: z.string().nonempty("La dirección es obligatoria"),
  // countryId: z.string().nonempty("El país es obligatorio"),
  // provinceId: z.string().nonempty("La provincia es obligatoria"),
  // locationId: z.string().nonempty("La localidad es obligatoria"),
});
