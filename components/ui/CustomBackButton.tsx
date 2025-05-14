import React from "react";
import { Pressable } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { router } from "expo-router";

type Props = {};

export default function CustomBackButton({}: Props) {
  const goBack = () => {
    router.back();
  };
  return (
    <Pressable onPress={goBack}>
      <IconSymbol size={20} name="chevron.backward" color={"#007AFF"} />
    </Pressable>
  );
}
