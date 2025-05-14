import { api } from "@/api/axios/api";
import { TransportEntityListResponse } from "@/types/search/TransportEntity";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListTransportEntity = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<TransportEntityListResponse> => {
  const searchedWord = queryKey[1] as string;

  const raw = {
    resource: "Orden De Cargas",
    pageNumber: 0,
    pageSize: 100,
    advancedSearch: {
      fields: ["businessName"],
      keyword: searchedWord || "",
    },
  };

  const response = await api.post("v1/entities/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
