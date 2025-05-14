import { api } from "@/api/axios/api";
import { SearchPurchaseOrderFilesResponse } from "@/types/purchaseOrders/SearchPurchaseOrders";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchPurchaseOrderFiles = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchPurchaseOrderFilesResponse> => {
  const [, purchaseOrderId] = queryKey;

  const raw = {
    purchaseOrderId: purchaseOrderId,
    pageNumber: 0,
    pageSize: 100,
  };

  const response = await api.post("v1/purchaseorderfiles/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
