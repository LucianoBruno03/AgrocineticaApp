import { api } from "@/api/axios/api";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchDomain = async ({ domain }: { domain: string }) => {
  if (!domain) {
    throw new Error("DOMAIN es undefined o no válido");
  }

  const response = await api.get(`v1/teams/getteam/${domain}`, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
