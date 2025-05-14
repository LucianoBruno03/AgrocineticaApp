import { api } from "@/api/axios/api";
import { PurchaseOrders } from "@/types/purchaseOrders/SearchPurchaseOrders";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchPurchaseOrderById = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<PurchaseOrders> => {
  const id = queryKey[1] as string;

  const response = await api.get(`v1/purchaseorders/${id}`, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
