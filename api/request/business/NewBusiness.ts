import { api } from "@/api/axios/api";
import { LoginSchema } from "@/schemas/login";
import { BusinessSchema } from "@/schemas/newBusiness";
import { CreateBusiness } from "@/types/business/NewBusiness";
import dayjs from "dayjs";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchNewBusiness = async (
  data: z.infer<typeof BusinessSchema>
): Promise<CreateBusiness> => {
  // transformar loq ue haya que transformar
  // data.loadTime = dayjs(data.loadTime).format("HH:mm:ss");
  // data.unloadTime = dayjs(data.unloadTime).format("HH:mm:ss");
  // data.customerRate = parseFloat(data.customerRate as any);
  // data.transportRate = parseFloat(data.transportRate as any);

  // colocar solo las keys necesarias a cambiar
  const formatedData = {
    ...data,
  } as z.infer<typeof BusinessSchema>;
  const response = await api.post("v1/businesses", formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
