import React, { useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface SelectItem {
  label: string;
  value: string;
}

interface ItemsSelectProps {
  label?: string;
  value: string | null;
  onBlur: () => void;
  onChange: (value: string) => void;
  error?: { message?: string };
  data: SelectItem[];
  placeholder?: string;
}

export const ItemsSelect: React.FC<ItemsSelectProps> = ({
  label = "Select an item",
  value,
  onBlur,
  onChange,
  error,
  data,
  placeholder,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "black" : "white";
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const TOP_POSITION = -8;
  const CENTER_POSITION = 14;

  const [searchText, setSearchText] = useState("");
  const animatedValue = useRef(
    new Animated.Value(value ? TOP_POSITION : CENTER_POSITION)
  ).current;

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    Animated.timing(animatedValue, {
      toValue: TOP_POSITION,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      handleClose();
    }
  }, []);

  const handleClose = () => {
    bottomSheetModalRef.current?.dismiss();
    setSearchText("");
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: CENTER_POSITION,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur();
  };

  const handleSelect = useCallback(
    (item: SelectItem) => {
      onChange(item.value);
      handleClose();
    },
    [onChange]
  );

  const labelStyle = {
    top: animatedValue,
    fontSize: animatedValue.interpolate({
      inputRange: [TOP_POSITION, CENTER_POSITION],
      outputRange: [14, 16],
    }),
  };

  const filteredData = data.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedItem = data.find((item) => item.value === value);

  return (
    <BottomSheetModalProvider>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            onPress={handlePresentModalPress}
            style={styles.touchable}
          >
            <Animated.Text style={[styles.label, labelStyle]}>
              {label}
            </Animated.Text>
            <TextInput
              style={[styles.input, { color }]}
              value={selectedItem?.label || ""}
              editable={false}
              placeholder={placeholder}
            />
            <TouchableOpacity
              style={styles.endAdornment}
              onPress={handlePresentModalPress}
            >
              <Ionicons name="chevron-down-outline" size={24} color="#0093D1" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
      {error?.message && (
        <Text style={styles.errorMessage}>{error.message}</Text>
      )}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["40%"]} // Ajusta la altura para que no suba demasiado
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
            opacity={0.5} // Reduce la opacidad para mejor integración con el stack
          />
        )}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <BottomSheetTextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <View style={styles.listContainer}>
            {filteredData.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.itemContainer,
                  item.value === value && styles.selectedItem,
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text
                  style={[
                    styles.itemText,
                    { color },
                    item.value === value && styles.selectedItemText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 48,
    borderRadius: 12,
    width: "100%",
    position: "relative",
  },
  inputWrapper: {
    position: "relative",
    height: "100%",
  },
  touchable: {
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    paddingStart: 20,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0093D110",
  },
  label: {
    position: "absolute",
    left: 12,
    color: "#0093D1",
    paddingHorizontal: 4,
    fontWeight: "bold",
    zIndex: 1,
  },
  endAdornment: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 5,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  bottomSheetBackground: {
    backgroundColor: "#fff",
  },
  bottomSheetContent: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    backgroundColor: "#0093D110",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listContainer: {
    gap: 8,
  },
  itemContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#0093D110",
  },
  selectedItem: {
    backgroundColor: "#0093D1",
  },
  itemText: {
    fontSize: 16,
  },
  selectedItemText: {
    color: "white",
  },
});
