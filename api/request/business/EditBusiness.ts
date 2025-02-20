import { api } from "@/api/axios/api";
import { EditBusinessSchema } from "@/schemas/newBusiness";
import { ParsedForm } from "@/types/business/NewBusiness";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchEditBusiness = async ({
  data,
  id,
}: {
  data: z.infer<typeof EditBusinessSchema>;
  id: string;
}): Promise<ParsedForm> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof EditBusinessSchema>;
  const response = await api.put(`v1/businesses/${id}`, formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
