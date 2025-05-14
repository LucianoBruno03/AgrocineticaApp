import { api } from "@/api/axios/api";
import { ServiceStationsListResponse } from "@/types/search/ServiceStations";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListServiceStations = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<ServiceStationsListResponse> => {
  const searchedWord = queryKey[1] as string;
  const entityId = queryKey[2] as string;

  const raw = {
    advancedSearch: {
      fields: ["name"],
      keyword: searchedWord || "",
    },
    pageNumber: 0,
    pageSize: 25,
    entityId: entityId,
  };

  const response = await api.post("v1/servicestations/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
