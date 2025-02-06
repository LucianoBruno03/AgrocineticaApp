import { api } from "@/api/axios/api";
import { UnloadingPointsListResponse } from "@/types/search/UnloadingPoints";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListUnloadingPoints = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<UnloadingPointsListResponse> => {
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

  const response = await api.post("v1/unloadingpoints/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
