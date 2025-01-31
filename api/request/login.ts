import { LoginSchema } from "@/schemas/login";
import axios from "axios";
import * as z from "zod";
import { api } from "../axios/api";
import { LoginResponse } from "@/types/auth/auth";

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
