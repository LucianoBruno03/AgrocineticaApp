import { api } from "@/api/axios/api";
import { SearchModelsResponse } from "@/types/models/Models";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchModels = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchModelsResponse> => {
  const [, searchWord, brandId, page] = queryKey;

  const raw = {
    keyword: searchWord || "",
    pageNumber: page || 0,
    pageSize: 10,
    orderBy: [],
    brandId: brandId || "",
  };

  const response = await api.post("v1/models/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
