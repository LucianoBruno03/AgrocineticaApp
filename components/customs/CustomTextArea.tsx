import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useRef } from "react";
import { FieldError, Noop } from "react-hook-form";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface CustomTextAreaProps {
  label?: string;
  value: string | number | undefined;
  onBlur: Noop;
  onChangeText: (...event: any[]) => void;
  error?: FieldError | undefined;
  placeholder?: string;
  endAdornment?: React.ReactNode;
  startAdorment?: React.ReactNode;
  inputProps?: TextInputProps;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  minHeight?: number;
}

export const CustomTextArea = ({
  label,
  value,
  placeholder,
  onBlur,
  onChangeText,
  error,
  endAdornment,
  startAdorment,
  inputProps,
  disabled = false,
  multiline = true,
  numberOfLines = 4,
  minHeight = 100,
}: CustomTextAreaProps) => {
  const colorScheme = useColorScheme() ?? "light";

  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const animatedValue = React.useRef(
    new Animated.Value(value ? TOP_POSITION : CENTER_POSITION)
  ).current;

  const inputRef = useRef<TextInput>(null);

  React.useLayoutEffect(() => {
    animatedValue.setValue(value ? TOP_POSITION : CENTER_POSITION);
  }, [value]);

  const handleFocus = () => {
    Animated.timing(animatedValue, {
      toValue: TOP_POSITION,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (e: any) => {
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: CENTER_POSITION,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur();
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const labelStyle = {
    top: animatedValue,
    fontSize: animatedValue.interpolate({
      inputRange: [TOP_POSITION, CENTER_POSITION],
      outputRange: [14, 16],
    }),
    color: error ? "#FF0000" : "#0093D1",
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          (error && styles.inputError) || {},
          { height: multiline ? minHeight : 48 },
        ]}
      >
        <View style={styles.inputWrapper}>
          {Boolean(startAdorment) && (
            <View style={styles.startAdornment}>{startAdorment}</View>
          )}
          <Pressable onPress={focusInput}>
            <Animated.Text
              style={[
                styles.label,
                labelStyle,
                disabled && {
                  color: colorScheme === "light" ? "#28282880" : "#555555",
                  zIndex: 1,
                },
              ]}
            >
              {label || placeholder}
            </Animated.Text>
          </Pressable>
          <TextInput
            editable={!disabled}
            ref={inputRef}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onChangeText={(text) => {
              onChangeText(text);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=""
            {...inputProps}
            style={[
              styles.input,
              !disabled && !error && { backgroundColor: "#0093D120" },
              Boolean(startAdorment) && { paddingLeft: 40 },
              multiline && {
                height: minHeight,
                textAlignVertical: "top",
                paddingTop: 12,
              },
              inputProps?.style || {},
              disabled && {
                backgroundColor:
                  colorScheme === "light" ? "#33333325" : "#AAAAAA20",
                zIndex: 1,
                color: colorScheme === "light" ? "#000" : "#fff",
              },
            ]}
            value={value !== undefined ? String(value) : ""}
          />
          {Boolean(endAdornment) && (
            <View style={styles.endAdornment}>{endAdornment}</View>
          )}
        </View>
      </View>
      {error && <Text style={styles.errorMessage}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 4,
  },
  inputWrapper: {
    position: "relative",
    height: "100%",
  },
  inputContainer: {
    borderRadius: 12,
    width: "100%",
    position: "relative",
  },
  inputError: {
    backgroundColor: "#FF000015",
    borderWidth: 1,
    borderColor: "#FF0000",
  },
  input: {
    flex: 1,
    color: "#000",
    fontSize: 16,
    width: "100%",
    padding: 10,
    paddingStart: 20,
    borderRadius: 12,
    zIndex: 1,
  },
  endAdornment: {
    position: "absolute",
    right: 8,
    top: 12,
    zIndex: 5,
  },
  startAdornment: {
    position: "absolute",
    left: 8,
    top: 12,
    zIndex: 5,
  },
  errorMessage: {
    color: "#FF0000",
    fontSize: 12,
    marginLeft: 12,
  },
  label: {
    position: "absolute",
    left: 12,
    paddingHorizontal: 4,
    fontWeight: "bold",
    zIndex: -1,
  },
});
