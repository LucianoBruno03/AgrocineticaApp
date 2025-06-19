import { api } from "@/api/axios/api";
import { ModelsSchema } from "@/schemas/Models";

import { CreateModels } from "@/types/models/Models";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchNewModels = async (
  data: z.infer<typeof ModelsSchema>
): Promise<CreateModels> => {
  // transformar loq ue haya que transformar
  // data.loadTime = dayjs(data.loadTime).format("HH:mm:ss");
  // data.unloadTime = dayjs(data.unloadTime).format("HH:mm:ss");
  // data.customerRate = parseFloat(data.customerRate as any);
  // data.transportRate = parseFloat(data.transportRate as any);

  // colocar solo las keys necesarias a cambiar
  const formatedData = {
    ...data,
  } as z.infer<typeof ModelsSchema>;
  const response = await api.post("v1/models", formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
