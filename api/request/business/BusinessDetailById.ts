import { api } from "@/api/axios/api";
import { BusinessDetails } from "@/types/business/SearchBusinessDetails";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchBusinessDetailById = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<BusinessDetails> => {
  const id = queryKey[1] as string;

  const response = await api.get(`v1/businessdetails/${id}`, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
