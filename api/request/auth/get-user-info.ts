import { api } from "@/api/axios/api";
import { User } from "@/types/auth/auth";

export const getInfoData = async (nameidentifier: string): Promise<User> => {
  const response = await api.get(`v1/entities/${nameidentifier}`);

  return response.data;
};
