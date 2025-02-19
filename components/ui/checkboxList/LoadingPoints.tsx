import { useColorScheme } from "@/hooks/useColorScheme.web";
import { usePathname, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function LoadingPointsList({ form }: { form: any }) {
  const colorScheme = useColorScheme() ?? "light";
  const router = useRouter();

  const currentRoute = usePathname();

  const [selectedValue, setSelectedValue] = useState<string | null>(
    form.getValues().businessesLoadingPoints.length > 0 ? "selected" : null
  );

  // Determine if component should be disabled
  const isDisabled = !form.getValues().entityId;

  // Color schemes for different states
  const colors = {
    light: {
      enabled: {
        text: "black",
        background: "#0093D120",
        label: "#0093D1",
      },
      disabled: {
        text: "#888888",
        background: "#AAAAAA50", //E0E0E0
        label: "#28282880",
      },
    },
    dark: {
      enabled: {
        text: "white",
        background: "#0093D150",
        label: "#0093D1",
      },
      disabled: {
        text: "#666666",
        background: "#333333",
        label: "#555555",
      },
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
        pathname: "/business/LoadingPoints",
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
    color: currentColorScheme.label,
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.inputWrapper,
          { backgroundColor: currentColorScheme.background },
        ]}
        onPress={handleSearch}
        disabled={isDisabled}
      >
        <Animated.Text style={[styles.label, labelStyle]}>
          Puntos de Carga
        </Animated.Text>
        <Text style={[styles.content, { color: currentColorScheme.text }]}>
          {form.getValues().businessesLoadingPoints.length > 0
            ? `${
                form.getValues().businessesLoadingPoints.length
              } seleccionado/s`
            : ""}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    height: 48,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    position: "relative",
  },
  label: {
    position: "absolute",
    left: 12,
    paddingHorizontal: 4,
    fontWeight: "bold",
    zIndex: 1,
    backgroundColor: "transparent",
  },
  content: {
    fontSize: 16,
  },
});
