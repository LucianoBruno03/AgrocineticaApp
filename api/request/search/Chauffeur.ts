import { api } from "@/api/axios/api";
import { ChauffeurListResponse } from "@/types/search/Chauffeur";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListChauffeur = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<ChauffeurListResponse> => {
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
    isAvailable: true,
    active: true,
  };

  const response = await api.post("v1/chauffeur/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
