import { api } from "@/api/axios/api";
import { EditLoadingOrdersSchema } from "@/schemas/LoadingOrders";
import { LoadingOrders } from "@/types/loadingOrders/SearchLoadingOrders";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchEditLoadingOrders = async ({
  data,
  id,
}: {
  data: z.infer<typeof EditLoadingOrdersSchema>;
  id: string;
}): Promise<LoadingOrders> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof EditLoadingOrdersSchema>;
  const response = await api.put(`v1/loadingorders/${id}`, formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
