import { useColorScheme } from "@/hooks/useColorScheme.web";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable } from "react-native";
import { ArrowLeftIcon } from "../ui/icons/ArrowLeftIcon";
import { ChevronLeftIcon } from "../ui/icons/ChevronLeftIcon";

type Props = {
  redirectUrl?: string | null;
};

export default function CustomBackButton({ redirectUrl = null }: Props) {
  const colorScheme = useColorScheme() ?? "light";

  const goBack = () => {
    if (redirectUrl) {
      router.replace(redirectUrl as any);
      return;
    }

    router.back();
  };
  return (
    <Pressable onPress={goBack}>
      {Platform.OS === "ios" ? (
        <ChevronLeftIcon width={28} height={28} color="#007AFF" />
      ) : (
        <ArrowLeftIcon
          width={24}
          height={24}
          color={colorScheme === "dark" ? "#fff" : "#000"}
        />
      )}
    </Pressable>
  );
}
