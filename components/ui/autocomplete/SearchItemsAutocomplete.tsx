import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, Animated, Text, Pressable } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useQuery } from "@tanstack/react-query";
import { fetchListItems } from "@/api/request/dropdown/ItemsDropdown";
import { useRouter } from "expo-router";

export default function SearchItemsAutocomplete({ form }: { form: any }) {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "black" : "white";
  const router = useRouter();

  const [selectedValue, setSelectedValue] = useState<string | null>(
    form.getValues().itemId
  );

  // Animation constants
  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const animatedValue = useRef(
    new Animated.Value(selectedValue ? TOP_POSITION : CENTER_POSITION)
  ).current;

  const handleSearch = () => {
    router.push({
      pathname: "/business/ItemsSelected",
      params: {
        currentFormData: JSON.stringify(form.getValues()),
      },
    });
  };

  const labelStyle = {
    top: animatedValue,
    fontSize: animatedValue.interpolate({
      inputRange: [TOP_POSITION, CENTER_POSITION],
      outputRange: [14, 16],
    }),
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.inputWrapper} onPress={handleSearch}>
        <Animated.Text style={[styles.label, labelStyle]}>Item</Animated.Text>
        <Text style={styles.content}>
          {form.getValues().itemName ? form.getValues().itemName : ""}
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
    backgroundColor: "#0093D120",
    borderRadius: 12,
    position: "relative",
  },
  label: {
    position: "absolute",
    left: 12,
    color: "#0093D1",
    paddingHorizontal: 4,
    fontWeight: "bold",
    zIndex: 1,
    backgroundColor: "transparent",
  },
  content: {
    fontSize: 14,
    marginTop: 8,
  },
});
