import { api } from "@/api/axios/api";
import { Units } from "@/types/units/SearchUnits";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchUnitsById = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<Units> => {
  const id = queryKey[1] as string;

  const response = await api.get(`v1/units/${id}`, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
