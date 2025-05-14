import { api } from "@/api/axios/api";
import { Business } from "@/types/business/SearchBusiness";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchBusinessById = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<Business> => {
  const id = queryKey[1] as string;

  const response = await api.get(`v1/businesses/${id}`, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
