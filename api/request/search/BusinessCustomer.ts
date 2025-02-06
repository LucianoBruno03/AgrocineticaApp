import { api } from "@/api/axios/api";
import { BusinessCustomerListResponse } from "@/types/search/BusinessCustomer";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListBusinessCustomer = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<BusinessCustomerListResponse> => {
  const searchedWord = queryKey[1] as string;

  const raw = {
    roles: ["Comercial"],
    pageNumber: 0,
    pageSize: 25,
    advancedSearch: {
      fields: ["FullName"],
      keyword: searchedWord || "",
    },
  };

  const response = await api.post("users/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
