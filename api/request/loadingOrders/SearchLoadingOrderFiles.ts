import { api } from "@/api/axios/api";
import { SearchLoadingOrderFilesResponse } from "@/types/loadingOrders/SearchLoadingOrders";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchLoadingOrderFiles = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchLoadingOrderFilesResponse> => {
  const [, loadingOrderId] = queryKey;

  const raw = {
    loadingOrderId: loadingOrderId,
    pageNumber: 0,
    pageSize: 100,
  };

  const response = await api.post("v1/loadingorderfiles/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
