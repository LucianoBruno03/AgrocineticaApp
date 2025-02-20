import { useColorScheme } from "@/hooks/useColorScheme.web";
import { usePathname } from "expo-router";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function ShipperAutoComplete({ form }: { form: any }) {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "black" : "white";
  const router = useRouter();

  const currentRoute = usePathname();

  const [selectedValue, setSelectedValue] = useState<string | null>(
    form.getValues().shipperName
  );

  useEffect(() => {
    const newValue = form.getValues().shipperName;
    setSelectedValue(newValue);

    Animated.timing(animatedValue, {
      toValue: newValue ? TOP_POSITION : CENTER_POSITION,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [form.watch("shipperName")]);

  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const animatedValue = useRef(
    new Animated.Value(selectedValue ? TOP_POSITION : CENTER_POSITION)
  ).current;

  const handleSearch = () => {
    router.push({
      pathname: "/business/Shipper",
      params: {
        currentFormData: JSON.stringify(form.getValues()),
        redirect: currentRoute,
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
        <Animated.Text style={[styles.label, labelStyle]}>
          Dador de carga
        </Animated.Text>
        <Text style={[styles.content, { color }]}>
          {form.getValues().shipperName ? form.getValues().shipperName : ""}
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
    fontSize: 16,
  },
});
