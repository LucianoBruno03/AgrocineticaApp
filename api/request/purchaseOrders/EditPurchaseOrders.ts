import { api } from "@/api/axios/api";
import { EditPurchaseOrdersSchema } from "@/schemas/PurchaseOrders";
import { PurchaseOrders } from "@/types/purchaseOrders/SearchPurchaseOrders";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchEditPurchaseOrders = async ({
  data,
  id,
}: {
  data: z.infer<typeof EditPurchaseOrdersSchema>;
  id: string;
}): Promise<PurchaseOrders> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof EditPurchaseOrdersSchema>;
  const response = await api.put(`v1/purchaseorders/${id}`, formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
