import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "@/components/customs/CustomDrawer";
import { useAuthStore } from "@/zustand/authStore";
import {
  SecureStoreGetItemAsync,
  SecureStoreSetItemAsync,
} from "@/lib/SecureStorageHelpers";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { api } from "@/api/axios/api";
import { Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { AxiosInterceptor } from "@/api/axios/axios.interceptors";
import { getInfoData } from "@/api/request/auth/get-user-info";
import { IUserInfo } from "@/types/auth/auth";

const getUserInfo = async () => {
  try {
    let token;

    const tokenZustand = (useAuthStore.getState() as any).accessToken;

    if (tokenZustand) {
      token = tokenZustand;
    } else {
      const tokenSecureStore = await SecureStoreGetItemAsync("token");
      if (tokenSecureStore) {
        token = tokenSecureStore;
      }
    }

    if (!token) {
      useAuthStore.getState().logout();
      return false;
    }

    useAuthStore.getState().setAccessToken(token);

    // const response = await api.get("personal/permissions");

    //   guardar claims

    // useAuthStore.getState().setClaims(response.data);

    const claimsDecoded = jwtDecode(token) as IUserInfo;

    useAuthStore.getState().setDecodedClaims(claimsDecoded);

    // const userResponse = await getInfoData(
    //   `${claimsDecoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]}`
    // );

    // useAuthStore.getState().setUser(userResponse);

    // return await response.data;
    // try {
    //   let token;

    //   const tokenZustand = (useAuthStore.getState() as any).accessToken;

    //   if (tokenZustand) {
    //     token = tokenZustand;
    //   } else {
    //     const tokenSecureStore = await SecureStoreGetItemAsync("token");
    //     if (tokenSecureStore) {
    //       token = tokenSecureStore;
    //     }
    //   }

    //   if (!token) {
    //     useAuthStore.getState().logout();
    //     return false;
    //   }

    //   const decodedToken = jwtDecode(token) as IUserInfo;

    //   const date = new Date();

    //   if (decodedToken.exp!! < date.getTime() / 1000) {
    //     useAuthStore.getState().logout();

    //     await SecureStoreSetItemAsync("token", "");
    //     return false;
    //   }

    //   if (!tokenZustand) useAuthStore.getState().setAccessToken(token);

    //   const response = await api.get(`/Clientes/GetAsync/${decodedToken.nameid}`);

    //   const data = response.data as ClientesGetAsyncResponse;

    //   useAuthStore.getState().setUser(data.clients);

    // const expoToken =
    //   (await SecureStoreGetItemAsync("expoToken")) ||
    //   useAuthStore.getState().expoToken;

    // const getExpoTokenStatus = await api.get<getAsyncResponse>(
    //   "/TokenExpo/GetAsync/" + data.clients.idClient
    // );

    // if (
    //   getExpoTokenStatus.data.result === false ||
    //   getExpoTokenStatus.data.tokenExpo.token !== expoToken ||
    //   getExpoTokenStatus.data.tokenExpo.active === null
    // ) {
    //   const addExpoToken = await api.post<getAsyncResponse>(
    //     "/TokenExpo/AddAsync",
    //     {
    //       idCliente: data.clients.idClient,
    //       token: expoToken,
    //     }
    //   );

    //   useAuthStore.getState().setNotificacions(addExpoToken.data.tokenExpo);

    //   return addExpoToken.data;
    // } else if (getExpoTokenStatus.data.tokenExpo.active !== null) {
    //   useAuthStore
    //     .getState()
    //     .setNotificacions(getExpoTokenStatus.data.tokenExpo);
    // }

    // Guardar el expo token con el userId

    return true;
  } catch (error) {
    return false;
  }
};

export default function Layout() {
  const { accessToken } = useAuthStore();

  const validateSessionQuery = useQuery({
    queryKey: ["validateSession", accessToken],
    queryFn: getUserInfo,
    staleTime: 1000 * 60,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (validateSessionQuery.isPending) {
    return <Text>Cagando...</Text>;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={CustomDrawer} screenOptions={{ title: "" }}>
        <Drawer.Screen
          name="business"
          options={{
            drawerLabel: "Negicios",
            headerShown: false, // Ocultamos el header para usar el del Stack
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
