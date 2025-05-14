import { useColorScheme } from "@/hooks/useColorScheme";
import { usePathname, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { FieldError } from "react-hook-form";

interface CustomCheckboxListProps {
  form: any;
  error?: FieldError;
  title: string;
  route: string;
  fieldName: string;
  isDisabled?: boolean;
}

export default function CustomCheckboxList({
  form,
  error,
  title,
  route,
  fieldName,
  isDisabled = false,
}: CustomCheckboxListProps) {
  const colorScheme = useColorScheme() ?? "light";
  const router = useRouter();
  const currentRoute = usePathname();

  const points = form.getValues()[fieldName] ?? [];
  const [selectedValue, setSelectedValue] = useState<string | null>(
    points.length > 0 ? "selected" : null
  );

  const colors = {
    light: {
      enabled: { text: "black", background: "#0093D120", label: "#0093D1" },
      disabled: { text: "black", background: "#AAAAAA50", label: "#28282880" },
    },
    dark: {
      enabled: { text: "white", background: "#0093D120", label: "#0093D1" },
      disabled: { text: "white", background: "#333333", label: "#555555" },
    },
  };

  const currentColorScheme = isDisabled
    ? colors[colorScheme].disabled
    : colors[colorScheme].enabled;

  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const animatedValue = useRef(
    new Animated.Value(selectedValue ? TOP_POSITION : CENTER_POSITION)
  ).current;

  const handleSearch = () => {
    if (!isDisabled) {
      router.push({
        pathname: route as any,
        params: {
          currentFormData: JSON.stringify(form.getValues()),
          redirect: currentRoute,
        },
      });
    }
  };

  const labelStyle = {
    top: animatedValue,
    fontSize: animatedValue.interpolate({
      inputRange: [TOP_POSITION, CENTER_POSITION],
      outputRange: [14, 16],
    }),
    color: error ? "#FF0000" : currentColorScheme.label,
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.inputWrapper,
          { backgroundColor: currentColorScheme.background },
          error && styles.inputError,
        ]}
        onPress={handleSearch}
        disabled={isDisabled}
      >
        <Animated.Text style={[styles.label, labelStyle]}>
          {title}
        </Animated.Text>
        <Text style={[styles.content, { color: currentColorScheme.text }]}>
          {points.length > 0 ? `${points.length} seleccionado/s` : ""}
        </Text>
      </Pressable>
      {error && <Text style={styles.errorMessage}>{error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", gap: 4 },
  inputWrapper: {
    height: 48,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    position: "relative",
  },
  inputError: {
    backgroundColor: "#FF000015",
    borderWidth: 1,
    borderColor: "#FF0000",
  },
  label: {
    position: "absolute",
    left: 12,
    paddingHorizontal: 4,
    fontWeight: "bold",
    zIndex: 1,
    backgroundColor: "transparent",
  },
  content: { fontSize: 16 },
  errorMessage: { color: "#FF0000", fontSize: 12, marginLeft: 12 },
});
