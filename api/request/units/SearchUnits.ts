import { api } from "@/api/axios/api";
import { SearchUnitsResponse } from "@/types/units/SearchUnits";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchUnits = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchUnitsResponse> => {
  const [, searchWord, page] = queryKey;

  const raw = {
    keyword: searchWord || "",
    pageNumber: page || 0,
    pageSize: 10,
    orderBy: [],
  };

  const response = await api.post("v1/units/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
