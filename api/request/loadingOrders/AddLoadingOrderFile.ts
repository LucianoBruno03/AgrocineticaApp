import { api } from "@/api/axios/api";
import { LoadingOrderFileSchema } from "@/schemas/LoadingOrders";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchAddLoadingOrderFile = async (
  data: z.infer<typeof LoadingOrderFileSchema>
): Promise<any> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof LoadingOrderFileSchema>;
  const response = await api.post("v1/loadingorderfiles", formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
