import { api } from "@/api/axios/api";
import { SearchLoadingOrdersResponse } from "@/types/loadingOrders/SearchLoadingOrders";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchLoadingOrders = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchLoadingOrdersResponse> => {
  const [
    ,
    searchWord,
    page,
    filterFields,
    searchWordFilter,
    pageSize,
    isPurchaseOrder,
  ] = queryKey;

  const raw = {
    advancedSearch: {
      fields: filterFields || [],
      keyword: searchWordFilter || "",
    },
    keyword: searchWord || "",
    pageNumber: page || 0,
    pageSize: pageSize || 10,
    orderBy: [],
    isPurchaseOrder: isPurchaseOrder || undefined,
  };

  if (!isPurchaseOrder) {
    delete raw.isPurchaseOrder;
  }

  const response = await api.post("v1/loadingorders/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
