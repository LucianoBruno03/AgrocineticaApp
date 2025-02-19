import { z } from "zod";

export const BusinessSchema = z
  .object({
    loadDate: z.string().nullable(),
    // .nonempty("La fecha de carga es requerida")
    loadTime: z.string().nullable(),
    unloadDate: z.string().nullable(),
    unloadTime: z.string().nullable(),
    itemId: z.string().nonempty("El item es requerido"), //Campo obligatorio.
    itemName: z.string().nonempty("El nombre del item es requerido"),
    customerRate: z.preprocess(
      (val) => (val === undefined ? 0 : val),
      z.number().min(1, "La tarifa cliente es requerida")
    ),
    transportRate: z.preprocess(
      (val) => (val === undefined ? 0 : val),
      z.number().min(1, "La tarifa transporte es requerida")
    ),
    quantity: z.number().min(1, "La cantidad es requerida"),
    businessUserId: z.string().nonempty("El usuario es requerido"),
    businessUserName: z.string().nonempty("El nombre del usuario es requerido"),
    userId: z.string(),
    userName: z.string(),
    entityId: z.string().nonempty("La entidad es requerida"),
    entityBusinessName: z.string().nullable(),
    // customerId: z.string(),
    shipperId: z.string().nonempty("El transportista es requerido"),
    shipperName: z.string(),
    commission: z.number().min(0, "La comisión es requerida"),
    isKilograms: z.boolean(),
    isKilometers: z.boolean(),
    isOrigin: z.boolean(),
    isDestination: z.boolean(),
    isWeightScaleOrigin: z.boolean(),
    isWeightScaleDestination: z.boolean(),
    isPhysicalPapers: z.boolean(),
    gatheringId: z.string().nonempty("El acopio es requerido"),
    gatheringName: z.string().nullable(),
    scaleId: z.string(),
    scaleName: z.string().nullable(),
    isScale: z.boolean(),
    cancellationReasonId: z.null().nullable(),
    showOnWeb: z.boolean(),
    businessesUnitTypes: z.array(
      z.object({
        businessId: z.string(),
        typeUnitId: z.string(),
        typeUnitName: z.string(),
      })
    ),
    businessesLoadingPoints: z.array(
      z.object({
        businessId: z.string(),
        loadingPointId: z.string(),
        order: z.number(),
        // distance: z.number(),
        // statusId: z.string(),
        // arrivalDate: z.string(),
        // loadedDate: z.string(),
        // isArrival: z.boolean(),
        // isLoaded: z.boolean(),
      })
    ),
    businessesUnloadingPoint: z.array(
      z.object({
        businessId: z.string(),
        unloadingPointId: z.string(),
        order: z.number(),
        // distance: z.number(),
        // statusId: z.string(),
        // arrivalDate: z.string(),
        // unloadedDate: z.string(),
        // isArrival: z.boolean(),
        // isUnloaded: z.boolean(),
      })
    ),
  })
  .refine((data) => data.transportRate >= data.customerRate, {
    message:
      "La tarifa cliente debe ser igual o menor a la tarifa de transporte",
    path: ["customerRate"],
  });
