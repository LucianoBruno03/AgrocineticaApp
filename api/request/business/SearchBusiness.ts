import { api } from "@/api/axios/api";
import { SearchBusinessResponse } from "@/types/business/SearchBusiness";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchBusiness = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchBusinessResponse> => {
  const [, searchWord, page] = queryKey;

  const raw = {
    keyword: searchWord || "",
    pageNumber: page || 0,
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
