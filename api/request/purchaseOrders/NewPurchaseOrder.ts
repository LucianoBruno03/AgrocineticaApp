import { api } from "@/api/axios/api";
import { PurchaseOrdersSchema } from "@/schemas/PurchaseOrders";
import { PurchaseOrders } from "@/types/purchaseOrders/SearchPurchaseOrders";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchNewPurchaseOrder = async (
  data: z.infer<typeof PurchaseOrdersSchema>
): Promise<PurchaseOrders> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof PurchaseOrdersSchema>;
  const response = await api.post("v1/purchaseorders", formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
