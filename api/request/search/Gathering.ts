import { api } from "@/api/axios/api";
import { GatheringListResponse } from "@/types/search/Gathering";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListGathering = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<GatheringListResponse> => {
  const searchedWord = queryKey[1] as string;
  const entityId = queryKey[2] as string;

  const raw = {
    advancedSearch: {
      fields: ["name"],
      keyword: searchedWord || "",
    },

    pageNumber: 1,
    pageSize: 25,
    entityId: entityId,
  };

  const response = await api.post("v1/gatherings/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
