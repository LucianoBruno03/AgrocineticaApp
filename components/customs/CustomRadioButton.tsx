import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Pressable,
} from "react-native";

const CustomRadioButton = ({
  options,
  onSelect,
  selectedValue,
  containerStyle = {},
  buttonStyle = {},
  selectedButtonStyle = {},
  textStyle = {},
  selectedTextStyle = {},
  disabled = false,
}: {
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  selectedValue: string;
  containerStyle?: object;
  buttonStyle?: object;
  selectedButtonStyle?: object;
  textStyle?: object;
  selectedTextStyle?: object;
  disabled?: boolean;
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const isDarkMode = colorScheme === "dark";

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        isDarkMode && styles.containerDark,
      ]}
    >
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.radioButton,
            buttonStyle,
            selectedValue === option.value && [
              styles.selectedButton,
              selectedButtonStyle,
              isDarkMode && styles.selectedButtonDark,
            ],
            disabled && { opacity: 1 },
          ]}
          onPress={() => onSelect(option.value)}
          disabled={disabled}
        >
          <View
            style={[styles.radioCircle, isDarkMode && styles.radioCircleDark]}
          >
            {selectedValue === option.value && (
              <View
                style={[
                  styles.selectedCircle,
                  isDarkMode && styles.selectedCircleDark,
                ]}
              />
            )}
          </View>
          <Text
            style={[
              styles.radioText,
              textStyle,
              isDarkMode && styles.radioTextDark,
              selectedValue === option.value && [
                styles.selectedText,
                isDarkMode && styles.selectedTextDark,
                selectedTextStyle,
              ],
              disabled && { color: "#555" },
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  containerDark: {
    // backgroundColor: "#121212",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    padding: 10,
    width: "auto",
    minWidth: "45%",
  },
  selectedButton: {
    // backgroundColor: "#f0f0f0",
  },
  selectedButtonDark: {
    // backgroundColor: "#333",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioCircleDark: {
    borderColor: "#fff",
  },
  selectedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  selectedCircleDark: {
    backgroundColor: "#fff",
  },
  radioText: {
    fontSize: 16,
    color: "#000",
  },
  radioTextDark: {
    color: "#fff",
  },
  selectedText: {
    fontWeight: "bold",
  },
  selectedTextDark: {
    color: "#ddd",
  },
});

export default CustomRadioButton;
