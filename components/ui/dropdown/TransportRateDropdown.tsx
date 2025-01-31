import React, { useRef, useState } from "react";
import { StyleSheet, View, Animated, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useQuery } from "@tanstack/react-query";
import { fetchListTransportRate } from "@/api/request/dropdown/TransportRateDropdown";
import { TransportRate } from "@/types/dropdown/TransportRateDropdown";
import { CustomTextField } from "@/components/CustomTextField";

export default function AnimatedTransportRateDropdown({ form }: { form: any }) {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "black" : "white";

  const [isFocus, setIsFocus] = useState(false);
  const [listDropdown, setListDropdown] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    form.getValues().itemId
  );
  const [searchedWord, setSearchedWord] = useState<string>("");

  // Animation constants
  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const animatedValue = useRef(
    new Animated.Value(selectedValue ? TOP_POSITION : CENTER_POSITION)
  ).current;

  const getTransportRateQuery = useQuery({
    queryKey: ["getTransportRateQuery", searchedWord],
    queryFn: fetchListTransportRate,
  });

  React.useEffect(() => {
    if (getTransportRateQuery.data) {
      const rawData = getTransportRateQuery.data?.data;
      if (Array.isArray(rawData)) {
        const dataDropdownMap = rawData.map((item: TransportRate) => ({
          label: item.businessName,
          value: item.id,
        }));
        setListDropdown(dataDropdownMap);

        const initialValue = dataDropdownMap.find(
          (item) => item.value === form.getValues().itemId
        );
        if (initialValue) {
          setSelectedValue(initialValue.value);
          animatedValue.setValue(TOP_POSITION);
        }
      }
    }
  }, [getTransportRateQuery.data, form.getValues().itemId]);

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
        <Animated.Text style={[styles.label, labelStyle]}>
          Cliente
        </Animated.Text>
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
          placeholder={isFocus ? "Seleccione un cliente" : ""}
          value={selectedValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(item) => {
            setSelectedValue(item.value);
            setIsFocus(false);
            form.setValue("itemId", item.value);
          }}
          renderInputSearch={(search) => (
            <CustomTextField
              placeholder="Buscar cliente"
              onChangeText={(text) => {
                setSearchedWord(text);
                search(text);
              }}
              inputProps={{
                style: {
                  borderRadius: 0,
                },
              }}
              value={searchedWord}
              onBlur={() => {}}
            />
          )}
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
