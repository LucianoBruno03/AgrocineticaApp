import { z } from "zod";

export const BusinessSchema = z
  .object({
    loadDate: z.string().nullable(),
    loadTime: z.string().nullable(),
    unloadDate: z.string().nullable(),
    unloadTime: z.string().nullable(),
    itemId: z.string().nonempty("El item es requerido"), //Campo obligatorio.
    itemName: z.string().nonempty("El nombre del item es requerido"), // Este campo no existe en el tipo original
    customerRate: z.preprocess(
      (val) => (val === undefined ? 0 : val),
      z.number().min(1, "La tarifa cliente es requerida") //Campo obligatorio.
    ),
    transportRate: z.preprocess(
      (val) => (val === undefined ? 0 : val),
      z.number().min(1, "La tarifa transporte es requerida") //Campo obligatorio.
    ),
    quantity: z.number().min(1, "La cantidad es requerida"), //Campo obligatorio.
    businessUserId: z.string().nonempty("Campo obligatorio"), //Campo obligatorio.
    businessUserName: z.string().nonempty("El nombre del usuario es requerido"),
    userId: z.string(),
    userName: z.string(),
    entityId: z.string().nonempty("Campo obligatorio"), //Campo obligatorio.
    entityBusinessName: z.string().nullable(), // Este campo no existe en el tipo original
    // customerId: z.string(),
    shipperId: z.string().nullable(),
    shipperName: z.string().nullable(), // Este campo no existe en el tipo original
    commission: z.number().min(0, "La comisión es requerida"), //Campo obligatorio.
    isKilograms: z.boolean(),
    isKilometers: z.boolean(),
    isOrigin: z.boolean(),
    isDestination: z.boolean(),
    isWeightScaleOrigin: z.boolean(),
    isWeightScaleDestination: z.boolean(),
    isPhysicalPapers: z.boolean(),
    gatheringId: z.string().nonempty("El acopio es requerido"), //Campo obligatorio.
    gatheringName: z.string().nullable(), // Este campo no existe en el tipo original
    scaleId: z.string().nullable(),
    scaleName: z.string().nullable(), // Este campo no existe en el tipo original
    isScale: z.boolean(),
    cancellationReasonId: z.null().nullable(),
    showOnWeb: z.boolean(),
    businessesUnitTypes: z
      .array(
        z.object({
          businessId: z.string(),
          typeUnitId: z.string(),
          typeUnitName: z.string(),
        })
      )
      .nonempty("Selecciona al menos un tipo de unidad"),
    businessesLoadingPoints: z
      .array(
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
      )
      .nonempty("Selecciona al menos un punto de carga"),
    businessesUnloadingPoint: z
      .array(
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
      )
      .nonempty("Selecciona al menos un punto de descarga"),
  })
  .refine((data) => data.customerRate >= data.transportRate, {
    message:
      "La tarifa cliente debe ser igual o menor a la tarifa de transporte",
    path: ["customerRate"],
  })
  .refine((data) => !data.isScale || (data.scaleId && data.scaleName), {
    message: "Debes seleccionar una balanza o desactivar la opción",
    path: ["scaleId"],
  });

export const EditBusinessSchema = z
  .object({
    id: z.string(),
    loadDate: z.string().nullable(),
    loadTime: z.string().nullable(),
    unloadDate: z.string().nullable(),
    unloadTime: z.string().nullable(),
    itemId: z.string().nonempty("El item es requerido"), //Campo obligatorio.
    itemName: z.string().nonempty("El nombre del item es requerido"), // Este campo no existe en el tipo original
    customerRate: z.preprocess(
      (val) => (val === undefined ? 0 : val),
      z.number().min(1, "La tarifa cliente es requerida") //Campo obligatorio.
    ),
    transportRate: z.preprocess(
      (val) => (val === undefined ? 0 : val),
      z.number().min(1, "La tarifa transporte es requerida") //Campo obligatorio.
    ),
    quantity: z.number().min(1, "La cantidad es requerida"), //Campo obligatorio.
    businessUserId: z.string().nonempty("Campo obligatorio"), //Campo obligatorio.
    businessUserName: z.string().nonempty("El nombre del usuario es requerido"),
    userId: z.string(),
    userName: z.string(),
    entityId: z.string().nonempty("Campo obligatorio"), //Campo obligatorio.
    entityBusinessName: z.string().nullable(), // Este campo no existe en el tipo original
    shipperId: z.string().nullable(),
    shipperName: z.string().nullable(), // Este campo no existe en el tipo original
    commission: z.number().min(0, "La comisión es requerida"), //Campo obligatorio.
    isKilograms: z.boolean(),
    isKilometers: z.boolean(),
    isOrigin: z.boolean(),
    isDestination: z.boolean(),
    isWeightScaleOrigin: z.boolean(),
    isWeightScaleDestination: z.boolean(),
    isPhysicalPapers: z.boolean(),
    gatheringId: z.string().nonempty("El acopio es requerido"), //Campo obligatorio.
    gatheringName: z.string().nullable(), // Este campo no existe en el tipo original
    scaleId: z.string().nullable(),
    scaleName: z.string().nullable(), // Este campo no existe en el tipo original
    isScale: z.boolean(),
    businessStatusId: z.string(),
    businessStatusName: z.string(),
    cancellationReasonId: z.string().nullable(),
    showOnWeb: z.boolean(),
    // businessesUnitTypes: z.array(
    //   z.object({
    //     businessId: z.string(),
    //     typeUnitId: z.string(),
    //     typeUnitName: z.string(),
    //   })
    // ),
    // businessesLoadingPoints: z
    //   .array(
    //     z.object({
    //       businessId: z.string(),
    //       loadingPointId: z.string(),
    //       order: z.number(),
    //       // distance: z.number(),
    //       // statusId: z.string(),
    //       // arrivalDate: z.string(),
    //       // loadedDate: z.string(),
    //       // isArrival: z.boolean(),
    //       // isLoaded: z.boolean(),
    //     })
    //   )
    //   .nonempty("Selecciona al menos un punto de carga"),
    // businessesUnloadingPoint: z
    //   .array(
    //     z.object({
    //       businessId: z.string(),
    //       unloadingPointId: z.string(),
    //       order: z.number(),
    //       // distance: z.number(),
    //       // statusId: z.string(),
    //       // arrivalDate: z.string(),
    //       // unloadedDate: z.string(),
    //       // isArrival: z.boolean(),
    //       // isUnloaded: z.boolean(),
    //     })
    //   )
    //   .nonempty("Selecciona al menos un punto de descarga"),
  })
  .refine((data) => data.customerRate >= data.transportRate, {
    message:
      "La tarifa cliente debe ser igual o menor a la tarifa de transporte",
    path: ["customerRate"],
  })
  .refine((data) => !data.isScale || (data.scaleId && data.scaleName), {
    message: "Debes seleccionar una balanza o desactivar la opción",
    path: ["scaleId"],
  });

export const ChangeStateSchema = z.object({
  id: z.string().optional(),
  businessId: z.string().optional(),
  businessDetailStatusId: z.string(),
  businessDetailStatusName: z.string().optional(),
});
