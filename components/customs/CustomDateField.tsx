import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Platform,
  Animated,
  TextInputProps,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FieldError, Noop } from "react-hook-form";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import dayjs from "dayjs";
import { ThemedText } from "../ThemedText";

interface CustomDateFieldProps {
  label?: string;
  value: string | undefined;
  onBlur: Noop;
  onChange: (date: string | undefined) => void;
  error?: FieldError | undefined;
  placeholder?: string;
  endAdornment?: React.ReactNode;
  startAdorment?: React.ReactNode;
  inputProps?: TextInputProps;
  type?: "date" | "time";
  disabled?: boolean;
}

export const CustomDateField: React.FC<CustomDateFieldProps> = ({
  label = "Fecha",
  value = undefined,
  onBlur,
  onChange,
  error,
  placeholder,
  endAdornment,
  startAdorment,
  inputProps,
  type = "date",
  disabled = false,
}) => {
  const colorScheme = useColorScheme() ?? "light";

  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => {
    if (!value) return new Date();
    if (type === "time") {
      const [hours, minutes, seconds] = value.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, seconds || 0, 0);
      return date;
    }
    return new Date(value);
  });

  const [modalOpacity] = useState(new Animated.Value(0));

  const animatedValue = useRef(
    new Animated.Value(value ? TOP_POSITION : CENTER_POSITION)
  ).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? TOP_POSITION : CENTER_POSITION,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const handleFocus = () => {
    if (disabled) return;
    Animated.timing(animatedValue, {
      toValue: TOP_POSITION,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setShowDatePicker(true);
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: CENTER_POSITION,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur();
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (type === "time") {
        const localDate = new Date();
        localDate.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
          0,
          0
        );
        setTempDate(localDate);
      } else {
        setTempDate(selectedDate);
      }

      if (Platform.OS === "android") {
        setShowDatePicker(false);
        onChange(formatDate(selectedDate));
      }
    }
  };

  const formatDate = (date: Date): string => {
    if (type === "date") {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}T00:00:00`;
    } else {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:00`;
    }
  };

  const handleAccept = () => {
    const formattedDate = formatDate(tempDate);
    onChange(formattedDate);
    setShowDatePicker(false);
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCancel = () => {
    setShowDatePicker(false);
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const labelStyle = {
    top: animatedValue,
    fontSize: animatedValue.interpolate({
      inputRange: [TOP_POSITION, CENTER_POSITION],
      outputRange: [14, 16],
    }),
    color: error
      ? "#FF0000"
      : disabled
      ? colorScheme === "light"
        ? "#28282880"
        : "#555555"
      : "#0093D1",
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
      height: 48,
      borderRadius: 12,
      width: "100%",
      position: "relative",
      backgroundColor: disabled
        ? colorScheme === "light"
          ? "#33333325"
          : "#AAAAAA20"
        : error
        ? "#FF000015"
        : "#0093D120",
    },
    inputContainerError: {
      borderWidth: 1,
      borderColor: "#FF0000",
    },
    input: {
      flex: 1,
      color: disabled
        ? colorScheme === "light"
          ? "#000"
          : "#fff"
        : Colors.light.text,
      fontSize: 16,
      width: "100%",
      padding: 10,
      paddingStart: 20,
      height: 48,
      borderRadius: 12,
      backgroundColor: "transparent",
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
      color: "#FF0000",
      fontSize: 12,
      marginLeft: 12,
    },
    label: {
      position: "absolute",
      left: 12,
      paddingHorizontal: 4,
      fontWeight: "bold",
      zIndex: 1,
      backgroundColor: "transparent",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: `${
        colorScheme === "light"
          ? `${Colors.light.background}`
          : `${Colors.dark.background}`
      }`,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 15,
    },
    modalButton: {
      padding: 10,
    },
    dataPicker: {
      backgroundColor: `${
        colorScheme === "light"
          ? `${Colors.light.background}`
          : `${Colors.dark.background}`
      }`,
      marginInline: "auto",
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={[styles.inputContainer, error && styles.inputContainerError]}
      >
        <View style={styles.inputWrapper}>
          {Boolean(startAdorment) && (
            <View style={styles.startAdornment}>{startAdorment}</View>
          )}
          <Pressable onPress={openDatePicker} disabled={disabled}>
            <Animated.Text style={[styles.label, labelStyle]}>
              {label}
            </Animated.Text>
          </Pressable>
          <TextInput
            style={[
              styles.input,
              Boolean(startAdorment) && { paddingLeft: 40 },
              inputProps?.style,
            ]}
            value={
              value
                ? type === "date"
                  ? dayjs(value).format("DD/MM/YYYY")
                  : new Date(`2000-01-01T${value}`).toString().slice(16, 21)
                : ""
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPress={() => {
              !disabled && openDatePicker();
            }}
            editable={false}
            placeholder=""
          />
          <Pressable
            style={styles.endAdornment}
            onPress={openDatePicker}
            disabled={disabled}
          >
            <Ionicons
              name={type === "date" ? "calendar-outline" : "time-outline"}
              size={24}
              color={
                disabled
                  ? colorScheme === "light"
                    ? "#28282880"
                    : "#555555"
                  : error
                  ? "#FF0000"
                  : "#0093D1"
              }
            />
          </Pressable>
        </View>
      </View>
      {error && <Text style={styles.errorMessage}>{error.message}</Text>}

      {Platform.OS === "ios" && showDatePicker && (
        <Modal
          transparent={true}
          animationType="none"
          visible={showDatePicker}
          onRequestClose={handleCancel}
        >
          <Animated.View
            style={[styles.modalContainer, { opacity: modalOpacity }]}
          >
            <View style={styles.modalContent}>
              <View style={styles.dataPicker}>
                <DateTimePicker
                  value={tempDate}
                  mode={type}
                  display="spinner"
                  locale="es-ES"
                  onChange={handleDateChange}
                  textColor="#0093D1"
                />
              </View>
              <View style={styles.modalButtons}>
                <Pressable onPress={handleCancel} style={styles.modalButton}>
                  <ThemedText>Cancelar</ThemedText>
                </Pressable>
                <Pressable onPress={handleAccept} style={styles.modalButton}>
                  <ThemedText>Aceptar</ThemedText>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </Modal>
      )}

      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode={type}
          display="spinner"
          locale="es-ES"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};
