import { api } from "@/api/axios/api";
import { CustomerRateListResponse } from "@/types/dropdown/CustomerRateDropdown";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListCustomerRate = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<CustomerRateListResponse> => {
  const raw = {
    roles: ["Transporte", "Cliente", "Chofer"],
    pageNumber: 0,
    pageSize: 10,
    advancedSearch: {
      fields: ["FullName"],
      keyword: "",
    },
  };

  const response = await api.post("users/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
