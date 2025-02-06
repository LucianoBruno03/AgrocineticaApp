import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Checkbox from "expo-checkbox";
import {
  UnloadingPoints,
  UnloadingPointsListResponse,
} from "@/types/search/UnloadingPoints";
import { fetchListUnloadingPoints } from "@/api/request/search/UnloadingPoints";

export default function SearchScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const router = useRouter();
  const { currentFormData } = useLocalSearchParams<{
    currentFormData: string;
  }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<UnloadingPoints[]>([]);
  const searchedWord = useDebounce(searchQuery, 500);

  const getUnloadingPointsQuery = useQuery<UnloadingPointsListResponse>({
    queryKey: ["getUnloadingPointsQuery", searchedWord],
    queryFn: fetchListUnloadingPoints,
  });

  useEffect(() => {
    if (
      currentFormData &&
      getUnloadingPointsQuery.data &&
      selectedItems.length === 0
    ) {
      const parsedForm = JSON.parse(currentFormData);
      // const selectedItemsFromForm = parsedForm.businessesUnitTypes || [];

      const preSelectedItems = parsedForm.businessesUnloadingPoint
        .map((point: any) =>
          getUnloadingPointsQuery.data.data.find(
            (item) => item.id === point.unloadingPointId
          )
        )
        .filter(Boolean);

      setSelectedItems(preSelectedItems);
    }
  }, [getUnloadingPointsQuery.data?.data]);

  const handleSelect = (item: UnloadingPoints) => {
    setSelectedItems((current) =>
      current.some((selected) => selected.id === item.id)
        ? current.filter((selected) => selected.id !== item.id)
        : [...current, item]
    );
  };

  const saveAndGoBack = () => {
    const parsedForm = JSON.parse(currentFormData);

    const newFormValues = {
      ...parsedForm,
      businessesUnloadingPoint: selectedItems.map((item, index) => ({
        businessId: parsedForm.entityId,
        unloadingPointId: item.id,
        order: index + 1,
      })),
    };

    const newFormData = JSON.stringify(newFormValues);

    router.back();

    router.replace({
      pathname: "/business/new-business",
      params: {
        currentFormData: newFormData,
      },
    });
  };
  const renderContent = () => {
    if (getUnloadingPointsQuery.isLoading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator
            size="large"
            color={colorScheme === "light" ? "#000" : "#fff"}
          />
          <ThemedText type="default" style={styles.statusText}>
            Cargando...
          </ThemedText>
        </View>
      );
    }

    if (getUnloadingPointsQuery.isError) {
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
      (!getUnloadingPointsQuery.data?.data ||
        getUnloadingPointsQuery.data.data.length === 0)
    ) {
      return (
        <View style={styles.centeredContainer}>
          <ThemedText type="default" style={styles.statusText}>
            No se encontraron resultados para "{searchedWord}"
          </ThemedText>
        </View>
      );
    }

    return (
      <FlatList
        data={getUnloadingPointsQuery.data?.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Fragment>
            <Pressable
              style={styles.section}
              onPress={() => handleSelect(item)}
            >
              <Checkbox
                style={styles.checkbox}
                value={selectedItems.some(
                  (selected) => selected.id === item.id
                )}
                onValueChange={() => handleSelect(item)}
              />
              <ThemedText type="default" style={styles.listItemText}>
                {item.name}
                {/* SI ESTA SELECIONADO MOSTRAR EL INDEX +1 */}
              </ThemedText>
              <Text style={styles.index}>
                {selectedItems.some((selected) => selected.id === item.id)
                  ? ` (${
                      selectedItems.findIndex(
                        (selected) => selected.id === item.id
                      ) + 1
                    })`
                  : ""}
              </Text>
            </Pressable>
          </Fragment>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={saveAndGoBack}
        style={[
          styles.saveButton,
          {
            opacity: selectedItems.length > 0 ? 1 : 0.5,
            backgroundColor: selectedItems.length > 0 ? "#0093D1" : "#a0a0a0",
          },
        ]}
        disabled={selectedItems.length === 0}
      >
        <ThemedText
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: selectedItems.length > 0 ? "white" : "gray",
          }}
        >
          Guardar ({selectedItems.length})
        </ThemedText>
      </Pressable>
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
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    fontSize: 20,
    zIndex: 1,
  },
  index: {
    color: "#0093D1",
    fontWeight: "bold",
    fontSize: 16,
  },
});
