import { api } from "@/api/axios/api";
import { SearchCancellationReasonsResponse } from "@/types/categoriesTypes/SearchCancellationReasons";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchCancellationReasons = async ({
  queryKey,
}: {
  queryKey: QueryKey;
} & {}): Promise<SearchCancellationReasonsResponse> => {
  const [, id, searchWord] = queryKey;

  const raw = {
    cancellationTypeId: id, //"ESTADOS DEL NEGOCIO",
    pageNumber: 0,
    pageSize: 10,
    advancedSearch: {
      fields: ["name"],
      keyword: searchWord || "",
    },
  };

  const response = await api.post("v1/cancellationReasons/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
