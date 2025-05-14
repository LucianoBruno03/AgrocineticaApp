import { api } from "@/api/axios/api";
import { LoadingOrders } from "@/types/loadingOrders/SearchLoadingOrders";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchLoadingOrderById = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<LoadingOrders> => {
  const id = queryKey[1] as string;

  const response = await api.get(`v1/loadingorders/${id}`, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
