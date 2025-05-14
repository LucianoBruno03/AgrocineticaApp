import { api } from "@/api/axios/api";
import { PurchaseOrderItemSchema } from "@/schemas/PurchaseOrders";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchAddPurchaseOrderItem = async (
  data: z.infer<typeof PurchaseOrderItemSchema>
): Promise<any> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof PurchaseOrderItemSchema>;
  const response = await api.post("v1/purchaseorderitems", formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
