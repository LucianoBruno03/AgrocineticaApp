import { api } from "@/api/axios/api";
import { SearchBusinessResponse } from "@/types/business/searchBusiness";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchBusiness = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchBusinessResponse> => {
  const raw = {
    pageNumber: 1,
    pageSize: 10,
    orderBy: [],
  };

  const response = await api.post("v1/businesses/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
