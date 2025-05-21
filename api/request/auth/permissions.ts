import { SecureStoreGetItemAsync } from "@/lib/SecureStorageHelpers";
import { IUserInfo } from "@/types/auth/auth";
import { useAuthStore } from "@/zustand/authStore";
import { jwtDecode } from "jwt-decode";

export const getUserInfo = async () => {
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
