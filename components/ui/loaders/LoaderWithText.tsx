import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";

type Props = {};

const LoaderWithText = (props: Props) => {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <View style={styles.centeredContainer}>
      <ActivityIndicator
        size="large"
        color={colorScheme === "light" ? "#000" : "#fff"}
      />
      <ThemedText type="default" style={styles.statusText}>
        Cargando...
      </ThemedText>
    </View>
  );
};

export default LoaderWithText;

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
  },
});
