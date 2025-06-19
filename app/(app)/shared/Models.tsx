import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";

import { fetchSearchModels } from "@/api/request/models/SearchModels";
import { ThemedText } from "@/components/ThemedText";
import { AddIcon } from "@/components/ui/icons/AddIcon";
import LoaderWithText from "@/components/ui/loaders/LoaderWithText";
import { useColorScheme } from "@/hooks/useColorScheme";
import useDebounce from "@/hooks/useDebounce";
import { Models, SearchModelsResponse } from "@/types/models/Models";
import { useAuthStore } from "@/zustand/authStore";

export default function SearchScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const router = useRouter();
  const { redirect, currentFormData, formFieldId, formFieldName } =
    useLocalSearchParams<{
      currentFormData: string;
      redirect: string;
      formFieldId: string;
      formFieldName: string;
    }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchedWord = useDebounce(searchQuery, 500);
  const { claims } = useAuthStore();

  const brandId = JSON.parse(currentFormData).brandId;

  const getModelsQuery = useQuery<SearchModelsResponse>({
    queryKey: ["getModelsQuery", searchedWord, brandId],
    queryFn: fetchSearchModels,
    enabled: !!brandId,
  });

  const handleSelect = (item: Models) => {
    const parsedForm = JSON.parse(currentFormData);

    const newFormValues = {
      ...parsedForm,

      [formFieldId]: item.id,
      [formFieldName]: item.name,
    };

    const newFormData = JSON.stringify(newFormValues);

    router.back();

    router.replace({
      pathname: redirect as any,
      params: {
        currentFormData: newFormData,
      },
    });
  };

  const renderContent = () => {
    if (getModelsQuery.isLoading) {
      return <LoaderWithText />;
    }

    if (getModelsQuery.isError) {
      return (
        <View style={styles.centeredContainer}>
          <ThemedText type="default" style={styles.errorText}>
            Error al cargar los resultados
          </ThemedText>
        </View>
      );
    }

    if (
      searchedWord &&
      (!getModelsQuery.data?.data || getModelsQuery.data.data.length === 0)
    ) {
      return (
        <View style={styles.centeredContainer}>
          <ThemedText type="default" style={styles.statusText}>
            {`No se encontraron resultados para "${searchedWord}"`}
          </ThemedText>
        </View>
      );
    }

    return (
      <FlatList
        data={getModelsQuery.data?.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelect(item)}
            style={[
              styles.listItem,
              {
                borderBottomColor:
                  colorScheme === "light" ? "#28282850" : "#444",
              },
            ]}
          >
            <ThemedText type="default" style={styles.listItemText}>
              {item.name}
            </ThemedText>
          </Pressable>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Escribe para buscar más opciones..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[
          styles.input,
          {
            color: colorScheme === "light" ? "black" : "white",
            borderColor: colorScheme === "light" ? "#28282850" : "#444",
          },
        ]}
        autoFocus
      />

      {renderContent()}

      {claims?.includes("Permissions.Modelos.Create") && (
        <Pressable
          style={styles.newButton}
          onPress={() => {
            router.push("/(app)/add/AddModel");
          }}
        >
          <AddIcon
            width={40}
            height={40}
            color="white"
            style={styles.textButton}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 48,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    marginBottom: 8,
    margin: 6,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#28282860",
  },
  listItemText: {
    fontSize: 14,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
  },
  newButton: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "#ABCA48",
    borderRadius: 100,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    zIndex: 100,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    textAlign: "center",
    borderRadius: 100,
  },
});
