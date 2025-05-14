import { api } from "@/api/axios/api";
import { SearchPurchaseOrderItemsResponse } from "@/types/purchaseOrders/SearchPurchaseOrders";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchPurchaseOrderItems = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchPurchaseOrderItemsResponse> => {
  const [, purchaseOrderId] = queryKey;

  const raw = {
    purchaseOrderId: purchaseOrderId,
    pageNumber: 0,
    pageSize: 100,
  };

  const response = await api.post("v1/purchaseorderitems/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
