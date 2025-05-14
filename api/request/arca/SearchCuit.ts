import { api } from "@/api/axios/api";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchCuitQuery = async ({ cuit }: { cuit: string }) => {
  if (!cuit) {
    throw new Error("CUIT es undefined o no válido");
  }

  const response = await api.get(`v1/arca/getpeoplea4withouttoken/${cuit}`, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
