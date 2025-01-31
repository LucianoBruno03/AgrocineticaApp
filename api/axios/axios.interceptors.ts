import { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

import { api } from "./api";
import { useAuthStore } from "@/zustand/authStore";

interface RequestWithSecureStore extends AxiosRequestConfig {
  data?: any; // Any type for data, depending on use case
}

const updateHeader = async (request: InternalAxiosRequestConfig) => {
  const tokenZustand = (useAuthStore.getState() as any).accessToken;

  if (tokenZustand) {
    request.headers["Authorization"] = `Bearer ${tokenZustand}`;
  } else {
    const tokenSecureStore = await SecureStore.getItemAsync("token");
    if (tokenSecureStore) {
      request.headers["Authorization"] = `Bearer ${tokenSecureStore}`;
    }
  }

  if (request.data instanceof FormData) {
    request.headers["Content-Type"] = "multipart/form-data";
  } else {
    request.headers["Content-Type"] = "application/json";
  }

  const newHeaders = {
    "Access-Control-Allow-Origin": "*",
    accept: "/",
  };

  // Verifica si la solicitud es FormData o JSON y establece el tipo de contenido apropiado
  // if (request.data instanceof FormData) {
  //   newHeaders["Content-Type"] = "multipart/form-data";
  // } else {
  //   newHeaders["Content-Type"] = "application/json";
  // }

  // if (token) {
  //   newHeaders.Authorization = `Bearer ${token}`;
  // }

  // // Actualiza los encabezados de la solicitud
  // request.headers = { ...request.headers, ...newHeaders };

  return request;
};

export const AxiosInterceptor = () => {
  api.interceptors.request.use((request) => {
    return updateHeader(request);
  });

  // apiV2.interceptors.request.use((request) => {
  //   return request;
  // });
};
