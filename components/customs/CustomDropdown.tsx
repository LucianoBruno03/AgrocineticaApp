import { StyleSheet, View, Animated, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FieldError } from "react-hook-form";
import { useColorScheme } from "@/hooks/useColorScheme";

export interface DropdownItem {
  label: string;
  value: string;
  [key: string]: any;
}

function useFloatingLabel(initialValue: string | null | undefined) {
  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const animatedValue = useRef(
    new Animated.Value(initialValue ? TOP_POSITION : CENTER_POSITION)
  ).current;

  const animateToTop = () => {
    Animated.timing(animatedValue, {
      toValue: TOP_POSITION,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animateToCenter = () => {
    Animated.timing(animatedValue, {
      toValue: CENTER_POSITION,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
    top: animatedValue,
    fontSize: animatedValue.interpolate({
      inputRange: [TOP_POSITION, CENTER_POSITION],
      outputRange: [14, 16],
    }),
  };

  return { animateToTop, animateToCenter, labelStyle };
}

function useDropdownTheme() {
  const colorScheme = useColorScheme() ?? "light";

  return {
    textColor: colorScheme === "light" ? "black" : "white",
    disabledTextColor: colorScheme === "light" ? "#28282880" : "#555555",
    backgroundColor: "#0093D120",
    disabledBackgroundColor:
      colorScheme === "light" ? "#33333325" : "#AAAAAA20",
    accentColor: "#0093D1",
    errorColor: "#FF0000",
    errorBackgroundColor: "#FF000015",
  };
}

interface CustomDropdownProps {
  label: string;
  value?: string;
  onChange?: (value: string, item?: DropdownItem) => void;
  items?: DropdownItem[];
  form?: any;
  fieldName?: string;
  error?: FieldError;
  fetchDataFn?: () => Promise<any>;
  queryKey?: Array<string | string[]>;
  searchEnabled?: boolean;
  disabled?: boolean;
  placeholder?: string;
  dataMapper?: (item: any) => DropdownItem;
  dependsOn?: string;
}

export default function CustomDropdown({
  label,
  value: externalValue,
  onChange: externalOnChange,
  items,
  form,
  fieldName,
  error,
  fetchDataFn,
  queryKey = ["dropdown-data"],
  searchEnabled = true,
  disabled = false,
  placeholder,
  dataMapper = (item) => ({
    label: item.name || item.label || String(item),
    value: item.id || item.value || String(item),
  }),
  dependsOn,
}: CustomDropdownProps) {
  const isFormMode = !!(form && fieldName);
  const isIndependentMode =
    externalValue !== undefined && externalOnChange !== undefined;

  if (!isFormMode && !isIndependentMode && !items && !fetchDataFn) {
    console.warn("CustomDropdown: Debe proporcionar un modo de uso válido");
  }

  const theme = useDropdownTheme();
  const [isFocus, setIsFocus] = useState(false);
  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>(
    items || []
  );
  const initialValue = isFormMode
    ? form.getValues()?.[fieldName]
    : externalValue;
  const [selectedValue, setSelectedValue] = useState<string | null>(
    initialValue
  );
  const { animateToTop, animateToCenter, labelStyle } =
    useFloatingLabel(initialValue);

  const isQueryEnabled =
    fetchDataFn && (!dependsOn || (form && form.getValues()?.[dependsOn]));
  const dataQuery =
    fetchDataFn &&
    useQuery({
      queryKey,
      queryFn: fetchDataFn,
      enabled: !!isQueryEnabled,
    });

  useEffect(() => {
    if (items) {
      setDropdownItems(items);
      return;
    }

    if (dataQuery?.data) {
      const rawData = Array.isArray(dataQuery.data)
        ? dataQuery.data
        : dataQuery.data?.data || [];
      if (Array.isArray(rawData)) {
        const mappedItems = rawData.map(dataMapper);
        setDropdownItems(mappedItems);
      }
    }
  }, [dataQuery?.data, items, dependsOn && form?.getValues()?.[dependsOn]]);

  useEffect(() => {
    if (selectedValue) {
      animateToTop();
    } else if (!isFocus) {
      animateToCenter();
    }
  }, [selectedValue]);

  useEffect(() => {
    if (isIndependentMode && externalValue !== selectedValue) {
      setSelectedValue(externalValue);
    }
  }, [externalValue]);

  const handleFocus = () => {
    if (disabled) return;
    setIsFocus(true);
    animateToTop();
  };

  const handleBlur = () => {
    setIsFocus(false);
    if (!selectedValue) {
      animateToCenter();
    }
  };

  const handleChange = (item: DropdownItem) => {
    setSelectedValue(item.value);
    setIsFocus(false);

    if (isFormMode && form) {
      form.setValue(fieldName, item.value);
    }

    if (externalOnChange) {
      externalOnChange(item.value, item);
    }
  };

  const getPlaceholderText = () => {
    if (!isFocus) return "";
    return placeholder || `Seleccione ${label.toLowerCase()}`;
  };

  const combinedLabelStyle = {
    ...styles.label,
    ...labelStyle,
    color: error
      ? theme.errorColor
      : disabled
      ? theme.disabledTextColor
      : theme.accentColor,
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: error
              ? theme.errorBackgroundColor
              : theme.backgroundColor,
          },
          error && styles.inputError,
          disabled && { backgroundColor: theme.disabledBackgroundColor },
        ]}
      >
        <Animated.Text style={combinedLabelStyle}>{label}</Animated.Text>
        <Dropdown
          style={[
            styles.dropdown,
            { backgroundColor: "transparent" }, // Make dropdown background transparent
          ]}
          disable={disabled}
          iconStyle={{
            tintColor: error
              ? theme.errorColor
              : disabled
              ? theme.disabledTextColor
              : theme.accentColor,
          }}
          placeholderStyle={[
            styles.placeholderStyle,
            { color: disabled ? theme.disabledTextColor : theme.textColor },
          ]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            { color: disabled ? theme.disabledTextColor : theme.textColor },
          ]}
          data={dropdownItems}
          search={searchEnabled}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={getPlaceholderText()}
          searchPlaceholder="Buscar..."
          value={selectedValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          renderLeftIcon={() => null}
        />
      </View>
      {error && (
        <Text style={[styles.errorMessage, { color: theme.errorColor }]}>
          {error.message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 4,
  },
  inputWrapper: {
    position: "relative",
    height: 48,
    borderRadius: 12,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#FF0000",
  },
  inputDisabled: {
    opacity: 0.8,
  },
  dropdown: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    position: "absolute",
    left: 12,
    paddingHorizontal: 4,
    fontWeight: "bold",
    zIndex: 1,
    backgroundColor: "transparent",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  errorMessage: {
    fontSize: 12,
    marginLeft: 12,
  },
});
