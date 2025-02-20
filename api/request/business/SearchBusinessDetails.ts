import { api } from "@/api/axios/api";
import { SearchBusinessDetailsResponse } from "@/types/business/SearchBusinessDetails";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchBusinessDetails = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<SearchBusinessDetailsResponse> => {
  const [, businessId] = queryKey;

  const raw = {
    businessId: businessId || "",
    pageNumber: 0,
    pageSize: 50,
  };

  const response = await api.post("v1/businessdetails/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
