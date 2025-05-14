import { api } from "@/api/axios/api";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchCTGQuery = async ({
  CTG,
  userId,
}: {
  CTG: number | string;
  userId: string;
}) => {
  if (!CTG) {
    throw new Error("CTG es undefined o no válido");
  }
  if (!userId) {
    throw new Error("userId es undefined o no válido");
  }

  const response = await api.get(`v1/arca/getautomotivecpe/${CTG}/${userId}`, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
