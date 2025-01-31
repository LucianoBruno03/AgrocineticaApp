import axios from "axios";
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: BASE_URL + "/api",
  withCredentials: true,
});
