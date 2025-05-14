import { api } from "@/api/axios/api";
import { EditPurchaseOrderItemSchema } from "@/schemas/PurchaseOrders";
import { LoadingOrders } from "@/types/loadingOrders/SearchLoadingOrders";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchEditPurchaseOrderItem = async ({
  data,
  id,
}: {
  data: z.infer<typeof EditPurchaseOrderItemSchema>;
  id: string;
}): Promise<LoadingOrders> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof EditPurchaseOrderItemSchema>;
  const response = await api.put(`v1/purchaseorderitems/${id}`, formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
