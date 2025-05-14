import { useColorScheme } from "@/hooks/useColorScheme";
import { RelativePathString, usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { FieldError } from "react-hook-form";

interface AutocompleteProps {
  form: any;
  formField: string; // Field name in the form (e.g., 'scaleName', 'itemId')
  displayField?: string; // Field to display (e.g., 'scaleName', 'itemName')
  label: string; // Label text (e.g., 'Balanza', 'Item', 'Cliente')
  navigationPath: string; // Navigation path (e.g., '/business/Scales')
  error?: FieldError;
  disabled?: boolean;
  enableCondition?: string; // Field name to watch for enabling/disabling (e.g., 'isScale')
  colors?: {
    light: {
      enabled: ColorScheme;
      disabled: ColorScheme;
    };
    dark: {
      enabled: ColorScheme;
      disabled: ColorScheme;
    };
  };
  keysToClear?: string[]; // Keys to clear in the form when navigating
}

interface ColorScheme {
  text: string;
  background: string;
  label: string;
}

const defaultColors = {
  light: {
    enabled: {
      text: "black",
      background: "#0093D120",
      label: "#0093D1",
    },
    disabled: {
      text: "black",
      background: "#33333325",
      label: "#28282880",
    },
  },
  // "#28282880" : "#555555"
  dark: {
    enabled: {
      text: "white",
      background: "#0093D120",
      label: "#0093D1",
    },
    disabled: {
      text: "white",
      background: "#AAAAAA20",
      label: "#555555",
    },
  },
};

export default function Autocomplete({
  form,
  formField,
  displayField,
  label,
  navigationPath,
  error,
  disabled: propDisabled = false,
  enableCondition,
  colors: customColors,
  keysToClear = [],
}: AutocompleteProps) {
  const colorScheme = useColorScheme() ?? "light";
  const router = useRouter();
  const currentRoute = usePathname();

  const [isDisabled, setIsDisabled] = useState<boolean>(
    propDisabled ||
      (enableCondition ? !form.getValues()[enableCondition] : false)
  );

  const colors = customColors || defaultColors;

  const fieldToDisplay = displayField || formField;
  const [selectedValue, setSelectedValue] = useState<string | null>(
    form.getValues()[fieldToDisplay]
  );

  useEffect(() => {
    if (enableCondition) {
      setIsDisabled(!form.watch(enableCondition));
    }
  }, [enableCondition && form.watch(enableCondition)]);

  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const animatedValue = useRef(
    new Animated.Value(selectedValue ? TOP_POSITION : CENTER_POSITION)
  ).current;

  useEffect(() => {
    const newValue = form.getValues()[fieldToDisplay];
    setSelectedValue(newValue);

    Animated.timing(animatedValue, {
      toValue: newValue ? TOP_POSITION : CENTER_POSITION,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [form.watch(fieldToDisplay)]);

  const currentColorScheme = isDisabled
    ? colors[colorScheme].disabled
    : colors[colorScheme].enabled;

  const handleSearch = () => {
    if (!isDisabled) {
      router.push({
        pathname: navigationPath as unknown as RelativePathString,
        params: {
          currentFormData: JSON.stringify(form.getValues()),
          redirect: currentRoute,
          formFieldId: formField,
          formFieldName: fieldToDisplay,
          keysToClear: JSON.stringify(keysToClear),
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
          isDisabled && styles.disabled,
        ]}
        onPress={handleSearch}
        disabled={isDisabled}
      >
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>
        <Text style={[styles.content, { color: currentColorScheme.text }]}>
          {form.getValues()[fieldToDisplay] || ""}
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
    borderRadius: 12,
    position: "relative",
  },
  disabled: {
    opacity: 1,
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
  content: {
    fontSize: 16,
  },
  errorMessage: {
    color: "#FF0000",
    fontSize: 12,
    marginLeft: 12,
  },
});
