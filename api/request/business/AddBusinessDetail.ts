import { api } from "@/api/axios/api";
import { AnyDataTag, QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchAddBusinessDetail = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<AnyDataTag> => {
  const [, id] = queryKey;

  const raw = {
    businessId: id,
  };

  const response = await api.post("v1/businessdetails", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
