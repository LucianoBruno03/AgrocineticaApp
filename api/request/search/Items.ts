import { api } from "@/api/axios/api";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListItems = async ({ queryKey }: { queryKey: QueryKey }) => {
  const searchedWord = queryKey[1] as string;

  const raw = {
    resource: "Negocios",
    pageNumber: 0,
    pageSize: 100,
    advancedSearch: {
      fields: ["name"],
      keyword: searchedWord || "",
    },
  };

  const response = await api.post("v1/item/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
