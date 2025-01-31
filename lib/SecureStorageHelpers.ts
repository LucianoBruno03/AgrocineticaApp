import * as SecureStore from "expo-secure-store";

export const SecureStoreGetItemAsync = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

export const SecureStoreSetItemAsync = async (key: string, value: string) => {
  return await SecureStore.setItemAsync(key, value);
};
