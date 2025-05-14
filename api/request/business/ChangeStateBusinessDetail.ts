import { api } from "@/api/axios/api";
import { ChangeStateSchema } from "@/schemas/newBusiness";
import { AnyDataTag } from "@tanstack/react-query";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchChangeStateBusinessDetail = async ({
  data,
  id,
}: {
  data: z.infer<typeof ChangeStateSchema>;
  id: string;
}): Promise<AnyDataTag> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof ChangeStateSchema>;
  const response = await api.put(`v1/businessdetails/${id}`, formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
