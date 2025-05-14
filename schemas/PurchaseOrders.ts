import { z } from "zod";

export const PurchaseOrdersSchema = z.object({
  loadingOrderId: z.string().nonempty("Selecciona un orden de carga"),
  loadingOrderIncrementId: z.number().min(0, "Selecciona un orden de carga"), // Este campo no existe en el tipo original
  issuingDate: z.string().nonempty("La fecha de emisión es requerida"), //Campo obligatorio.
  expirationDate: z.string(),
  userId: z.string(),
  userName: z.string(),
  cancellationReasonId: z.string().optional(),
  remittanceNumber: z.string(),
  completedDate: z.string().optional(),
  entityId: z.string().nonempty("El proveedor es requerido"), //Campo obligatorio.
  entityName: z.string(), // Este campo no existe en el tipo original
  serviceStationId: z.string().nonempty("La estación de servicio es requerida"), //Campo obligatorio.
  serviceStationName: z.string(), // Este campo no existe en el tipo original
  paymentMethodId: z.string().nonempty("El método de pago es requerido"), //Campo obligatorio.
  royalLiters: z.number().optional(),
  advance: z.number().optional(),
  total: z.number().optional(),
  observation: z.string().optional(),
  compliantDocumentation: z.boolean().optional(),
  documentationObservation: z.string().optional(),
  purchaseOrderItems: z.array(
    z.object({
      purchaseOrderId: z.string(),
      itemId: z.string(),
      quantity: z.number(),
    })
  ),
});

export const EditPurchaseOrdersSchema = z.object({
  id: z.string(),
  loadingOrderId: z.string().nonempty("Selecciona un orden de carga"),
  loadingOrderIncrementId: z.number().min(0, "Selecciona un orden de carga"), // Este campo no existe en el tipo original
  issuingDate: z.string().nonempty("La fecha de emisión es requerida"), //Campo obligatorio.
  expirationDate: z.string(),
  userId: z.string(),
  userName: z.string(),
  purchaseOrderStatusId: z.string(),
  purchaseOrderStatusName: z.string(),
  cancellationReasonId: z.string().nullable().optional(),
  loadingOrderEntityId: z.string(),
  remittanceNumber: z.string(),
  completedDate: z.string().optional(),
  entityId: z.string().nonempty("El proveedor es requerido"), //Campo obligatorio.
  entityName: z.string(), // Este campo no existe en el tipo original
  serviceStationId: z.string().nonempty("La estación de servicio es requerida"), //Campo obligatorio.
  serviceStationName: z.string(), // Este campo no existe en el tipo original
  paymentMethodId: z.string().nonempty("El método de pago es requerido"), //Campo obligatorio.
  royalLiters: z.number().min(0, "Los litros reales son requeridos"),
  advance: z.number().min(0, "El anticipo es requerido"),
  total: z.number().min(0, "El total es requerido"),
  observation: z.string().optional(),
  compliantDocumentation: z.boolean().optional(),
  documentationObservation: z.string().optional(),
  sendEmail: z.boolean(),
});

export const PurchaseOrderItemSchema = z.object({
  purchaseOrderId: z.string(),
  itemId: z.string().nonempty("Selecciona un item"),
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
});

export const EditPurchaseOrderItemSchema = z.object({
  id: z.string(),
  purchaseOrderId: z.string(),
  itemId: z.string().nonempty("Selecciona un item"),
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
});

export const PurchaseOrderFileSchema = z.object({
  purchaseOrderFiles: z.array(
    z.object({
      purchaseOrderId: z
        .string()
        .nonempty("El ID de la orden de compra no puede estar vacío"),
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
