import { useGoogleAutocomplete } from "@appandflow/react-native-google-autocomplete";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export const CustomTextFieldMaps = () => {
  const { locationResults, setTerm, clearSearch, searchDetails, term } =
    useGoogleAutocomplete(`${MAPS_API_KEY}`, {
      language: "en",
      debounce: 300,
    });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={term}
        onChangeText={setTerm}
        placeholder="Search location"
        placeholderTextColor="#aaa"
      />
      {locationResults.length > 0 && (
        <View style={styles.resultsContainer}>
          {locationResults.slice(0, 3).map((el, i) => (
            <TouchableOpacity
              key={String(i)}
              style={styles.option}
              onPress={async () => {
                const details = await searchDetails(el.place_id);
                console.warn(JSON.stringify(details, null, 2));
              }}
            >
              <Text style={styles.optionText}>
                {el.structured_formatting.main_text}
              </Text>
              <Text style={styles.secondaryText}>
                {el.structured_formatting.secondary_text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  textInput: {
    // borderRadius: 8,
    // backgroundColor: "#f0f0f0",
    width: "100%",
    fontSize: 16,
    padding: 10,
    paddingStart: 20,
    height: 48,
    borderRadius: 30,
    backgroundColor: "#0093D120",
  },
  resultsContainer: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  secondaryText: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
});
