import { api } from "@/api/axios/api";
import { SearchPurchaseOrdersResponse } from "@/types/purchaseOrders/SearchPurchaseOrders";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchPurchaseOrders = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchPurchaseOrdersResponse> => {
  const [, searchWord, page, filterFields, searchWordFilter] = queryKey;

  const raw = {
    advancedSearch: {
      fields: filterFields || [],
      keyword: searchWordFilter || "",
    },
    keyword: searchWord || "",
    pageNumber: page || 0,
    pageSize: 10,
    orderBy: [],
  };

  const response = await api.post("v1/purchaseOrders/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
