import { fetchSearchBrands } from "@/api/request/brands/SearchBrands";
import { ThemedText } from "@/components/ThemedText";
import { AddIcon } from "@/components/ui/icons/AddIcon";
import LoaderWithText from "@/components/ui/loaders/LoaderWithText";
import { useColorScheme } from "@/hooks/useColorScheme";
import useDebounce from "@/hooks/useDebounce";
import { Brands, SearchBrandsResponse } from "@/types/brands/SearchBrands";
import { useAuthStore } from "@/zustand/authStore";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";

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

  const getBrandsQuery = useQuery<SearchBrandsResponse>({
    queryKey: ["getBrandsQuery", searchedWord],
    queryFn: fetchSearchBrands,
  });

  const handleSelect = (item: Brands) => {
    const parsedForm = JSON.parse(currentFormData);

    const newFormValues = {
      ...parsedForm,

      // businessUserId: item.id,
      // businessUserName: item.fullName,

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
    if (getBrandsQuery.isLoading) {
      return <LoaderWithText />;
    }

    if (getBrandsQuery.isError) {
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
      (!getBrandsQuery.data?.data || getBrandsQuery.data.data.length === 0)
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
        data={getBrandsQuery.data?.data}
        keyExtractor={(item, index) => item.id ?? index.toString()}
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

      {claims?.includes("Permissions.Marcas.Create") && (
        <Pressable
          style={styles.newButton}
          onPress={() => {
            router.push("/(app)/add/AddBrand");
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
