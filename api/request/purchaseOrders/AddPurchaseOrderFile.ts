import { api } from "@/api/axios/api";
import { PurchaseOrderFileSchema } from "@/schemas/PurchaseOrders";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchAddPurchaseOrderFile = async (
  data: z.infer<typeof PurchaseOrderFileSchema>
): Promise<any> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof PurchaseOrderFileSchema>;
  const response = await api.post("v1/purchaseorderfiles", formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
