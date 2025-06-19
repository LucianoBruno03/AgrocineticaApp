import { api } from "@/api/axios/api";
import { UnitsSchema } from "@/schemas/newUnits";
import { CreateUnits } from "@/types/units/NewUnits";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchNewUnits = async (
  data: z.infer<typeof UnitsSchema>
): Promise<CreateUnits> => {
  // transformar loq ue haya que transformar
  // data.loadTime = dayjs(data.loadTime).format("HH:mm:ss");
  // data.unloadTime = dayjs(data.unloadTime).format("HH:mm:ss");
  // data.customerRate = parseFloat(data.customerRate as any);
  // data.transportRate = parseFloat(data.transportRate as any);

  // colocar solo las keys necesarias a cambiar
  const formatedData = {
    ...data,
  } as z.infer<typeof UnitsSchema>;
  const response = await api.post("v1/units", formatedData, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
