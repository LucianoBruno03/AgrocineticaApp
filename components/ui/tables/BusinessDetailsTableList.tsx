import { fetchSearchBusinessDetails } from "@/api/request/business/SearchBusinessDetails";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import BusinessDetailsCardList from "../cards/BusinessDetailsCardList";

const SearchSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
});

const BusinessDetailsTableList = () => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchedWord = useDebounce(searchQuery, 500);

  const { idBusiness } = useLocalSearchParams<{ idBusiness: string }>();

  const getBusinessDetailsQuery = useQuery({
    queryKey: ["getBusinessDetailsListQuery", idBusiness],
    queryFn: fetchSearchBusinessDetails,
  });

  return (
    <>
      {/* <View style={styles.container}>
        <View style={styles.searcher}>
          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <CustomTextField
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => {
                  setSearchQuery(value);
                  onChange(value);
                }}
                error={error}
                type="text"
                placeholder="Buscar por negocios"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="search"
          /> */}
      {/* <Pressable style={styles.searchButton} onPress={() => {}}>
            <IconSymbol size={28} name="magnifyingglass" color="white" />
          </Pressable> */}
      {/* </View>
      </View> */}

      {getBusinessDetailsQuery.isLoading ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Cargando...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.containerList}>
          <>
            {getBusinessDetailsQuery.data &&
            getBusinessDetailsQuery.data.data?.length > 0 ? (
              getBusinessDetailsQuery.data.data.map((business: any) => (
                <BusinessDetailsCardList key={business.id} item={business} />
              ))
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No hay negocios para mostrar.
                </Text>
              </View>
            )}
          </>
        </ScrollView>
      )}
    </>
  );
};

export default BusinessDetailsTableList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  containerList: {
    width: "100%",
    gap: 16,
  },
  searchButton: {
    position: "absolute",
    right: 4,
    top: "50%",
    transform: [{ translateY: "-50%" }],
    backgroundColor: "#0093D1",
    borderRadius: 50,
    padding: 8,
  },

  searcher: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  noDataContainer: {
    alignItems: "center",
    padding: 16,
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
  },
  textInput: {
    padding: 10,
    paddingStart: 20,
    height: 48,
    // borderRadius: 30,
    // backgroundColor: "#0093D120",
  },
});
