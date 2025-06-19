import { api } from "@/api/axios/api";
import { SearchBrandsResponse } from "@/types/brands/SearchBrands";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchBrands = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchBrandsResponse> => {
  const [, searchWord, page] = queryKey;

  const raw = {
    keyword: searchWord || "",
    pageNumber: page || 0,
    pageSize: 10,
    orderBy: [],
  };

  const response = await api.post("v1/brands/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
