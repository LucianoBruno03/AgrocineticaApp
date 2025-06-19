// id?: string;
//   entityId?: string;
//   entityBusinessName?: string;
//   domain?: string;
//   typeUnitId?: string;
//   typeUnitName?: string;
//   brandId?: string | undefined;
//   brandName?: string | undefined;
//   modelId?: string | undefined;
//   modelName?: string | undefined;
//   year?: number;
//   rutaExpiryDate?: Date | undefined;
//   civilLiabilityInsuranceExpiryDate?: Date | undefined;
//   observation?: string | undefined;
//   startDate?: Date | undefined;
//   endDate?: Date | undefined;
//   cargoInsuranceExpiryDate?: Date | undefined;
//   technicalInspectionExpiryDate?: Date | undefined;
//   scalableId?: string | undefined;
//   scalableName?: string | undefined;
//   isAvailable?: boolean;
//   active?: boolean;

import { z } from "zod";

export const UnitsSchema = z.object({
  entityId: z.string().nonempty("La entidad no puede estar vacía"),
  entityBusinessName: z.string().optional(),
  domain: z.string().nonempty("El dominio no puede estar vacío"),
  typeUnitId: z.string().nonempty("El tipo de unidad no puede estar vacío"),
  typeUnitName: z.string().optional(),
  brandId: z.string().optional(),
  brandName: z.string().optional(),
  modelId: z.string().optional(),
  modelName: z.string().optional(),
  year: z
    .number()
    .optional()
    .refine(
      (val) =>
        val === undefined || (val >= 1900 && val <= new Date().getFullYear()),
      {
        message: "El año debe ser un número entre 1900 y el año actual",
      }
    ),
  rutaExpiryDate: z.union([z.string(), z.null()]).optional(),
  civilLiabilityInsuranceExpiryDate: z.union([z.string(), z.null()]).optional(),
  observation: z.string().optional(),
  startDate: z.union([z.string(), z.null()]).optional(),
  endDate: z.union([z.string(), z.null()]).optional(),
  cargoInsuranceExpiryDate: z.union([z.string(), z.null()]).optional(),
  technicalInspectionExpiryDate: z.union([z.string(), z.null()]).optional(),
  scalableId: z.string().optional(),
  scalableName: z.string().optional(),
  isAvailable: z.boolean().default(true),
  active: z.boolean().default(true),
});
