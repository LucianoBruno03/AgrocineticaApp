import { api } from "@/api/axios/api";
import { LoadingPointsListResponse } from "@/types/search/LoadingPoints";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListLoadingPoints = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<LoadingPointsListResponse> => {
  const searchedWord = queryKey[1] as string;
  const entityId = queryKey[2] as string;

  const raw = {
    advancedSearch: {
      fields: [],
      keyword: searchedWord || "",
    },

    pageNumber: 1,
    pageSize: 100,
    entityId: entityId,
  };

  const response = await api.post("v1/loadingpoints/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
