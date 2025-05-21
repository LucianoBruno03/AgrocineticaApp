import { LoginSchema } from "@/schemas/login";
import { LoginResponse } from "@/types/auth/auth";
import * as z from "zod";
import { api } from "../axios/api";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const login = async (
  data: z.infer<typeof LoginSchema>
): Promise<LoginResponse> => {
  const response = await api.post("tokens", data, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
