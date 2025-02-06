import { api } from "@/api/axios/api";
import { CustomerListResponse } from "@/types/search/Customer";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListCustomer = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<CustomerListResponse> => {
  const searchedWord = queryKey[1] as string;

  const raw = {
    resource: "Negocios",
    pageNumber: 0,
    pageSize: 10,
    advancedSearch: {
      fields: ["businessName"],
      keyword: searchedWord || "",
    },
  };

  const response = await api.post("v1/entities/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
