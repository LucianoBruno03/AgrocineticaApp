import * as SecureStore from "expo-secure-store";

import { Claims, IUserInfo, User } from "@/types/auth/auth";
import { create } from "zustand";
// import { TokenExpo } from "../interfaces/expoToken/expoToken.interface";
// import { err } from "react-native-svg";

interface IAuthStore {
  user: User | null;
  accessToken: string | null;
  decodedClaims: IUserInfo | null;
  claims: Claims | null;
  //   expoToken: string | null;
  isAuth: boolean;
  //   notifications: TokenExpo | null;

  setAccessToken: (token: string) => void;
  setDecodedClaims: (claims: IUserInfo) => void;
  setClaims: (claims: Claims) => void;
  //   setNotificacions: (notifications: TokenExpo) => void;
  //   setExpoToken: (token: string) => void;
  setUser: (user: any) => void;

  logout: () => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  accessToken: null,
  decodedClaims: null,
  claims: null,
  expoToken: null,
  isAuth: false,
  notifications: null,

  setAccessToken: (token) => {
    set({ accessToken: token, isAuth: true });
  },
  //   setNotificacions: (notifications) => {
  //     set({ notifications: notifications });
  //   },
  //   setExpoToken: async (token) => {
  //     set({ expoToken: token });
  //   },

  setUser: (user) => {
    set({ user: user });
  },

  setDecodedClaims: (claims) => {
    set({ decodedClaims: claims });
  },

  setClaims: (claims: Claims) => {
    set({ claims: claims });
  },

  logout: async () => {
    try {
      set({ user: null, accessToken: null, isAuth: false });
      await SecureStore.deleteItemAsync("token");
    } catch (error) {
      console.error(error);
    }
  },
}));
