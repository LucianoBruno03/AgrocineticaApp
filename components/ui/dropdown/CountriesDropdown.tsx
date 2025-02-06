import { StyleSheet, View, Animated, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchListCountries } from "@/api/request/search/CountriesDropdown";

export interface CountriesDropdownData {
  id: string;
  name: string;
  ord: number;
  active: boolean;
}

export default function CountriesDropdown({ form }: { form: any }) {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "black" : "white";

  const [isFocus, setIsFocus] = useState(false);
  const [listDropdown, setListDropdown] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    form.getValues().countryId
  );

  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const animatedValue = useRef(
    new Animated.Value(selectedValue ? TOP_POSITION : CENTER_POSITION)
  ).current;

  const getCountriesQuery = useQuery({
    queryKey: ["getCountriesQuery", false],
    queryFn: fetchListCountries,
  });

  useEffect(() => {
    if (getCountriesQuery.data) {
      const rawData = getCountriesQuery.data?.data;
      if (Array.isArray(rawData)) {
        const dataDropdownMap = rawData.map((item: CountriesDropdownData) => ({
          label: item.name,
          value: item.id,
        }));
        setListDropdown(dataDropdownMap);

        const initialValue = dataDropdownMap.find(
          (item) => item.value === form.getValues().countryId
        );
        if (initialValue) {
          setSelectedValue(initialValue.value);
          animatedValue.setValue(TOP_POSITION);
        }
      }
    }
  }, [getCountriesQuery.data, form.getValues().countryId]);

  const handleFocus = () => {
    setIsFocus(true);
    Animated.timing(animatedValue, {
      toValue: TOP_POSITION,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocus(false);
    if (!selectedValue) {
      Animated.timing(animatedValue, {
        toValue: CENTER_POSITION,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
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
      <View style={styles.inputWrapper}>
        <Animated.Text style={[styles.label, labelStyle]}>País</Animated.Text>
        <Dropdown
          style={[styles.dropdown]}
          iconStyle={{ tintColor: color }}
          placeholderStyle={[styles.placeholderStyle, { color }]}
          selectedTextStyle={[styles.selectedTextStyle, { color }]}
          data={listDropdown}
          search={true}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={isFocus ? "Selecciona un país" : ""}
          searchPlaceholder="Buscar..."
          value={selectedValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(item) => {
            setSelectedValue(item.value);
            setIsFocus(false);
            form.setValue("countryId", item.value);
          }}
          renderLeftIcon={() => null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    position: "relative",
    height: 48,
  },
  dropdown: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0093D120",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    position: "absolute",
    left: 12,
    color: "#0093D1",
    paddingHorizontal: 4,
    fontWeight: "bold",
    zIndex: -1,
    backgroundColor: "transparent",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});
