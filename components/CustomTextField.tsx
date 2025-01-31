import React, { useRef } from "react";
import { FieldError, Noop } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";

interface CustomTextFieldProps {
  label?: string;
  value: string | undefined;
  onBlur: Noop;
  onChangeText: (...event: any[]) => void;
  error?: FieldError | undefined;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "nombre";
  endAdornment?: React.ReactNode;
  startAdorment?: React.ReactNode;
  inputProps?: TextInputProps;
  disabled?: boolean;
}

export const CustomTextField = ({
  label,
  value,
  placeholder,
  onBlur,
  onChangeText,
  error,
  type = "text",
  endAdornment,
  startAdorment,
  inputProps,
  disabled = false,
}: CustomTextFieldProps) => {
  const TOP_POSITION = -8; // Floating position
  const CENTER_POSITION = 14; // Center position

  const animatedValue = React.useRef(
    new Animated.Value(value ? TOP_POSITION : CENTER_POSITION)
  ).current;

  const inputRef = useRef<TextInput>(null); // Reference to the TextInput

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
      outputRange: [12, 16],
    }),
  };

  return (
    <React.Fragment>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          {Boolean(startAdorment) && (
            <View style={styles.startAdornment}>{startAdorment}</View>
          )}
          <TouchableOpacity onPress={focusInput}>
            <Animated.Text style={[styles.label, labelStyle]}>
              {label || placeholder}
            </Animated.Text>
          </TouchableOpacity>
          <TextInput
            editable={!disabled}
            ref={inputRef} // Attach the reference
            secureTextEntry={type === "password"}
            keyboardType={
              type === "email"
                ? "email-address"
                : type === "number"
                ? "numeric"
                : "default"
            }
            onChangeText={(text) => {
              if (type === "number") {
                // Permitir solo números
                const filteredText = text.replace(/[^0-9]/g, "");
                onChangeText(filteredText);
              } else {
                onChangeText(text);
              }
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=""
            {...inputProps}
            style={[
              styles.input,
              Boolean(startAdorment) && { paddingLeft: 40 },
              inputProps?.style || {},
            ]}
            value={value}
          />
          {Boolean(endAdornment) && (
            <View style={styles.endAdornment}>{endAdornment}</View>
          )}
        </View>
      </View>
      {error && <Text style={styles.errorMessage}>{error.message}</Text>}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: "relative",
    height: "100%",
  },
  inputContainer: {
    height: 48,
    borderRadius: 12,
    width: "100%",
    position: "relative",
  },
  input: {
    flex: 1,
    color: "#000",
    fontSize: 16,
    width: "100%",
    padding: 10,
    paddingStart: 20,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0093D110",
  },
  endAdornment: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 5,
  },
  startAdornment: {
    position: "absolute",
    left: 8,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 5,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    position: "absolute",
    left: 12,
    color: "#0093D1",
    paddingHorizontal: 4,
    fontWeight: "bold",
    zIndex: -1,
  },
});
