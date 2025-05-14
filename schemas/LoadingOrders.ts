import { z } from "zod";

export const LoadingOrdersSchema = z.object({
  businessDetailId: z.string(),
  destinationQuantity: z.number(),
  issuingDate: z.string(),
  loadDate: z.string(),
  journeyStart: z.string(),
  timeDifference: z.string(),
  capacity: z.number(),
  kgsUnloaded: z.number(),
  kgsDifference: z.number(),
  customerTolerance: z.number(),
  kmTraveled: z.number(),
  ctgNumber: z.string(),
  remittanceNumber: z.string(),
  userId: z.string(),
  userName: z.string(),
  loadingOrderStatusName: z.string(),
  cancellationReasonId: z.string(),
  billOfLading: z.string(),
  observation: z.string(),
  arrivalDate: z.string(),
  unloadedDate: z.string(),
  completedDate: z.string(),
  entityId: z.string(),
  entityName: z.string(),
  transportUserId: z.string(),
  transportUserName: z.string(),
  isCompliantDocumentation: z.boolean(),
  systemDocumentationDate: z.string(),
  userDocumentationDate: z.string(),
  distance: z.number(),
  isRemainingCapacity: z.boolean(),
  kilograms: z.number(),
  scalableId: z.string(),
  scalableName: z.string(), // Este campo no existe en el tipo original
  documentationObservation: z.string(),
  chassisId: z.string(),
  chassisName: z.string(),
  trailerId: z.string(),
  trailerName: z.string(),
  driverId: z.string(),
  driverName: z.string(),
  isItInvoiced: z.boolean(),
  isItSettled: z.boolean(),
  isBackOfficie: z.boolean(),
});

export const EditLoadingOrdersSchema = z.object({
  // Campos requeridos con mensajes de error
  id: z.string().nonempty("El ID no puede estar vacío"),
  businessDetailId: z
    .string()
    .nonempty("El detalle de negocio no puede estar vacío"),
  loadingOrderStatusId: z.string().nonempty("El estado no puede estar vacío"),
  entityId: z.string().nonempty("La entidad no puede estar vacía"),
  transportUserId: z.string().nonempty("Campo obligatorio"),
  scalableId: z.string().nonempty("El escalable no puede estar vacío"),
  chassisId: z.string().nonempty("El chasis no puede estar vacío"),
  trailerId: z.string().nonempty("El trailer no puede estar vacío"),
  driverId: z.string().nonempty("El conductor no puede estar vacío"),
  // ctgNumber: z.string().nonempty("El CTG no puede estar vacío"),
  ctgNumber: z.string().nullable().optional(),

  // Campos que no existe en el tipo original
  scalableName: z
    .string({ required_error: "El nombre del escalable es requerido" })
    .optional(),

  // Campos opcionales (nullable)
  destinationQuantity: z.number().nullable().optional(),
  issuingDate: z.string().nullable().optional(),
  loadDate: z.string().nullable().optional(),
  journeyStart: z.string().nullable().optional(),
  // En tu schema de validación (EditLoadingOrdersSchema)
  timeDifference: z
    .union([
      z.string().length(0), // Permite string vacío
      z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // O el formato que necesites
    ])
    .optional(), // O .nullable() dependiendo de tus necesidades
  capacity: z.number().nullable().optional(),
  kgsUnloaded: z.number().nullable().optional(),
  kgsDifference: z.number().nullable().optional(),
  customerTolerance: z.number().nullable().optional(),
  businessDetailBusinessEntityId: z.string().nullable().optional(),
  kmTraveled: z.number().nullable().optional(),
  remittanceNumber: z.string().nullable().optional(),
  userId: z.string().nullable().optional(),
  userName: z.string().nullable().optional(),
  loadingOrderStatusName: z.string().nullable().optional(),
  cancellationReasonId: z.string().nullable().optional(),
  billOfLading: z.string().nullable().optional(),
  observation: z.string().nullable().optional(),
  arrivalDate: z.string().nullable().optional(),
  unloadedDate: z.string().nullable().optional(),
  completedDate: z.string().nullable().optional(),
  transportUserName: z.string().nullable().optional(),
  isCompliantDocumentation: z.boolean().nullable().optional(),
  systemDocumentationDate: z.string().nullable().optional(),
  userDocumentationDate: z.string().nullable().optional(),
  distance: z.number().nullable().optional(),
  isRemainingCapacity: z.boolean().nullable().optional(),
  kilograms: z.number().nullable().optional(),
  documentationObservation: z.string().nullable().optional(),
  chassisName: z.string().nullable().optional(),
  trailerName: z.string().nullable().optional(),
  driverName: z.string().nullable().optional(),
  isItInvoiced: z.boolean().nullable().optional(),
  isItSettled: z.boolean().nullable().optional(),
});

export const LoadingOrderFileSchema = z.object({
  loadingOrderFiles: z.array(
    z.object({
      loadingOrderId: z
        .string()
        .nonempty("El ID de la orden de carga no puede estar vacío"),
      name: z.string().nonempty("El nombre no puede estar vacío"),
      fileExtension: z
        .string()
        .nonempty("La extensión del archivo no puede estar vacía"),
      file: z.object({
        name: z.string().nonempty("El nombre del archivo no puede estar vacío"),
        extension: z
          .string()
          .nonempty("La extensión del archivo no puede estar vacía"),
        data: z
          .string()
          .nonempty("Los datos del archivo no pueden estar vacíos"),
      }),
    })
  ),
});
