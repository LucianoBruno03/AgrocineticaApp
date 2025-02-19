import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  Animated,
  TextInputProps,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FieldError, Noop } from "react-hook-form";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import dayjs from "dayjs";

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
}) => {
  const colorScheme = useColorScheme() ?? "light";

  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [tempDate, setTempDate] = useState<Date>(
  //   value ? new Date(value) : new Date()
  // );
  const [tempDate, setTempDate] = useState<Date>(() => {
    if (!value) return new Date(); // Si no hay valor, usa la fecha actual
    if (type === "time") {
      const [hours, minutes, seconds] = value.split(":").map(Number);
      const date = new Date(); // Tomamos la fecha actual
      date.setHours(hours, minutes, seconds || 0, 0); // Seteamos la hora manualmente
      return date;
    }
    return new Date(value); // Si es una fecha, convertir directamente
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
      // Asegurar que la hora se maneje correctamente sin conversión a UTC
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
      color: `${Colors.light.text}`,
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
      marginTop: 0,
    },
    label: {
      position: "absolute",
      left: 12,
      color: "#0093D1",
      paddingHorizontal: 4,
      fontWeight: "bold",
      zIndex: 1,
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
    <View style={{ width: "100%", gap: 10 }}>
      <View style={[styles.inputContainer]}>
        <View style={styles.inputWrapper}>
          {Boolean(startAdorment) && (
            <View style={styles.startAdornment}>{startAdorment}</View>
          )}
          <TouchableOpacity onPress={openDatePicker}>
            <Animated.Text style={[styles.label, labelStyle]}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
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
            onPress={openDatePicker}
            editable={false}
            placeholder=""
          />
          <TouchableOpacity
            style={styles.endAdornment}
            onPress={openDatePicker}
          >
            <Ionicons
              name={type === "date" ? "calendar-outline" : "time-outline"}
              size={24}
              color="#0093D1"
            />
          </TouchableOpacity>
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
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.modalButton}
                >
                  <ThemedText>Cancelar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAccept}
                  style={styles.modalButton}
                >
                  <ThemedText>Aceptar</ThemedText>
                </TouchableOpacity>
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
