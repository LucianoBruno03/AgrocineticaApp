import { api } from "@/api/axios/api";
import { AnyDataTag } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchDeletePurchaseOrderFile = async ({
  id,
}: {
  id: string;
}): Promise<AnyDataTag> => {
  const response = await api.delete(`v1/purchaseorderfiles/${id}`, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
