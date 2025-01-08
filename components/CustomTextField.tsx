import { FieldError, Noop } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { InputType } from "../types";

interface CustomTextFieldProps {
  onBlur: Noop;
  onChangeText: (...event: any[]) => void;
  error?: FieldError | undefined;
  placeholder?: string;
  type?: InputType;
  endAdornment?: React.ReactNode;
  startAdorment?: React.ReactNode;
  inputProps?: TextInputProps;
}

export const CustomTextField = ({
  placeholder,
  onBlur,
  onChangeText,
  error,
  type = "text",
  endAdornment,
  startAdorment,
  inputProps,
}: CustomTextFieldProps) => {
  return (
    <View>
      <View style={styles.inputContainer}>
        {Boolean(startAdorment) && (
          <View style={styles.startAdornment}>{startAdorment}</View>
        )}
        <TextInput
          style={[styles.input, Boolean(startAdorment) && { paddingLeft: 40 }]}
          secureTextEntry={type === "password"}
          keyboardType={type === "email" ? "email-address" : "default"}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          {...inputProps}
        />
        {
          // si hay un endAdornment se muestra
          Boolean(endAdornment) && (
            <View style={styles.endAdornment}>{endAdornment}</View>
          )
        }
      </View>
      {
        // si hay un error se muestra
        error && <Text style={styles.errorMessage}>{error.message}</Text>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#ffff",
    color: "#000",
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
    position: "relative",
    display: "flex",
    borderColor: "#000",
    borderWidth: 1,
  },
  label: {
    color: "#000",
    position: "absolute",
    left: 8,
  },
  input: {
    flex: 1,
    color: "#000",
    fontSize: 16,
    width: "100%",
    height: "100%",
  },
  endAdornment: {
    position: "absolute",
    right: 8,
    flex: 1,
    zIndex: 5,
    marginVertical: 12,
  },
  startAdornment: {
    position: "absolute",
    left: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    marginVertical: 14,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
