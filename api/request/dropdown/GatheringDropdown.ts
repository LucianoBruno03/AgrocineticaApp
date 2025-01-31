import { api } from "@/api/axios/api";
import { GatheringListResponse } from "@/types/dropdown/GatheringDropdown";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListGathering = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<GatheringListResponse> => {
  const raw = {
    pageNumber: 0,
    pageSize: 10,
    advancedSearch: {
      fields: ["name"],
      keyword: "",
    },
  };

  const response = await api.post("v1/gatherings/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
