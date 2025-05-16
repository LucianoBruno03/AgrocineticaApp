import React from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
};

const GlobalSafeAreaView = ({ children }: Props) => {
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={Platform.OS === "android" ? ["bottom"] : []}
    >
      {children}
    </SafeAreaView>
  );
};

export default GlobalSafeAreaView;
