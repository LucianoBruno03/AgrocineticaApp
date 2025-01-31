import { fetchSearchBusiness } from "@/api/request/business/SearchBusiness";
import { CustomTextField } from "@/components/CustomTextField";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { IconSymbol } from "../IconSymbol";
import BusinessCardList from "../cards/BusinessCardList";

const SearchSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
});

const BusinessTableList = () => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";

  const getBusinessQuery = useQuery({
    queryKey: ["getBusinessListQuery"],
    queryFn: fetchSearchBusiness,
  });

  const form = useForm<z.infer<typeof SearchSchema>>({
    defaultValues: {
      search: "",
      type: "",
    },
  });

  const { control } = form;

  return (
    <>
      <View style={styles.container}>
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
                onChangeText={onChange}
                error={error}
                type="text"
                placeholder="Buscar por negocios"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="search"
          />
          <Pressable style={styles.searchButton} onPress={() => {}}>
            <IconSymbol size={28} name="magnifyingglass" color="white" />
          </Pressable>
        </View>
      </View>

      {getBusinessQuery.isLoading ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Cargando...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.containerList}>
          <>
            {getBusinessQuery.data && getBusinessQuery.data.data?.length > 0 ? (
              getBusinessQuery.data.data.map((business: any) => (
                <BusinessCardList key={business.id} item={business} />
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

export default BusinessTableList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  containerList: {
    width: "100%",
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
    borderRadius: 30,
    backgroundColor: "#0093D120",
  },
});
