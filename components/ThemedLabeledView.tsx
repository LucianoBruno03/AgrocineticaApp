import React, { ReactNode } from "react";
import { View, ViewProps, StyleSheet, TextStyle } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

import { Colors } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";

export type ThemedLabeledViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  label?: string;
  labelStyle?: TextStyle;
  children?: ReactNode;
};

export function ThemedLabeledView({
  style,
  lightColor,
  darkColor,
  label,
  labelStyle,
  children,
  ...otherProps
}: ThemedLabeledViewProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorScheme = useColorScheme() ?? "light";

  return (
    <ThemedView
      style={[
        styles.container,
        style,
        {
          borderColor:
            colorScheme === "light" ? Colors.light.border : Colors.dark.border,
        },
      ]}
      {...otherProps}
    >
      {label && (
        <ThemedView style={[styles.label]}>
          <ThemedText>{label}</ThemedText>
        </ThemedView>
      )}
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    position: "relative",
    width: "100%",
  },
  label: {
    position: "absolute",
    top: -14,
    left: 14,
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 8,
  },
});
