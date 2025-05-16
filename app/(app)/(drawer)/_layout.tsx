import CustomDrawer from "@/components/customs/CustomDrawer";
import CustomDrawerToggleButton from "@/components/customs/CustomDrawerToggleButton";
import { SecureStoreGetItemAsync } from "@/lib/SecureStorageHelpers";
import { IUserInfo } from "@/types/auth/auth";
import { useAuthStore } from "@/zustand/authStore";
import { useQuery } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import { jwtDecode } from "jwt-decode";
import { Text, View } from "react-native";

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
    // <GestureHandlerRootView style={{ flex: 1 }}> {/* ESTO LO HABIA COMENTADO NOSE XQ */}
    <Drawer
      drawerContent={CustomDrawer}
      screenOptions={{
        title: "",
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <CustomDrawerToggleButton />
          </View>
        ), // Botón de Drawer
      }}
    >
      <Drawer.Screen
        name="business"
        options={{
          drawerLabel: "Negocios",
          headerShown: false, // Ocultamos el header para usar el del Stack
        }}
      />

      <Drawer.Screen
        name="loadingOrders"
        options={{
          drawerLabel: "Ordenes de carga",
          headerShown: false, // Ocultamos el header para usar el del Stack
        }}
      />

      <Drawer.Screen
        name="purchaseOrders"
        options={{
          drawerLabel: "Ordenes de compra",
          headerShown: false, // Ocultamos el header para usar el del Stack
        }}
      />
    </Drawer>
    // </GestureHandlerRootView>
  );
}
