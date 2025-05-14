import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import useDebounce from "@/hooks/useDebounce";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import LoaderWithText from "@/components/ui/loaders/LoaderWithText";
import {
  ServiceStations,
  ServiceStationsListResponse,
} from "@/types/search/ServiceStations";
import { fetchListServiceStations } from "@/api/request/search/ServiceStations";

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

  const entityId = JSON.parse(currentFormData).entityId;

  const getServiceStationsQuery = useQuery<ServiceStationsListResponse>({
    queryKey: ["getServiceStationsQuery", searchedWord, entityId],
    queryFn: fetchListServiceStations,
    enabled: !!entityId,
  });

  const handleSelect = (item: ServiceStations) => {
    const parsedForm = JSON.parse(currentFormData);

    const newFormValues = {
      ...parsedForm,

      // entityId: item.id,
      // entityBusinessName: item.businessName,

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
    if (getServiceStationsQuery.isLoading) {
      return <LoaderWithText />;
    }

    if (getServiceStationsQuery.isError) {
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
      (!getServiceStationsQuery.data?.data ||
        getServiceStationsQuery.data.data.length === 0)
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
        data={getServiceStationsQuery.data?.data}
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
});
