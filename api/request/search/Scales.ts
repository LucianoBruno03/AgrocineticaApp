import { api } from "@/api/axios/api";
import { ScalesListResponse } from "@/types/search/Scales";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListScales = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<ScalesListResponse> => {
  const searchedWord = queryKey[1] as string;
  const entityId = queryKey[2] as string;

  const raw = {
    advancedSearch: {
      fields: ["name"],
      keyword: searchedWord || "",
    },
    // keyword: "string",
    // advancedFilter: {
    //   logic: "string",
    //   filters: ["string"],
    //   field: "string",
    //   operator: "string",
    //   value: "string",
    // },
    pageNumber: 1,
    pageSize: 25,
    // orderBy: ["string"],
    // entityId: entityId,
  };

  const response = await api.post("v1/scales/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
