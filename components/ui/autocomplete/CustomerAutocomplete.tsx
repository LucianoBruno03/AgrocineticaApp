import { useColorScheme } from "@/hooks/useColorScheme.web";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { FieldError } from "react-hook-form";

interface CustomerAutoCompleteProps {
  form: any;
  error?: FieldError;
}

export default function CustomerAutoComplete({
  form,
  error,
}: CustomerAutoCompleteProps) {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "black" : "white";
  const router = useRouter();

  const currentRoute = usePathname();

  const [selectedValue, setSelectedValue] = useState<string | null>(
    form.getValues().entityBusinessName
  );

  useEffect(() => {
    const newValue = form.getValues().entityBusinessName;
    setSelectedValue(newValue);

    Animated.timing(animatedValue, {
      toValue: newValue ? TOP_POSITION : CENTER_POSITION,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [form.watch("entityBusinessName")]);

  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const animatedValue = useRef(
    new Animated.Value(selectedValue ? TOP_POSITION : CENTER_POSITION)
  ).current;

  const handleSearch = () => {
    router.push({
      pathname: "/business/Customer",
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
      <Pressable
        style={[styles.inputWrapper, error && styles.inputError]}
        onPress={handleSearch}
      >
        <Animated.Text
          style={[styles.label, labelStyle, error && styles.labelError]}
        >
          Cliente
        </Animated.Text>
        <Text style={[styles.content, { color }]}>
          {form.getValues().entityBusinessName || ""}
        </Text>
      </Pressable>
      {error && <Text style={styles.errorMessage}>{error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 4,
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
  inputError: {
    backgroundColor: "#FF000015",
    borderWidth: 1,
    borderColor: "#FF0000",
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
  labelError: {
    color: "#FF0000",
  },
  content: {
    fontSize: 16,
  },
  errorMessage: {
    color: "#FF0000",
    fontSize: 12,
    marginLeft: 12,
  },
});
