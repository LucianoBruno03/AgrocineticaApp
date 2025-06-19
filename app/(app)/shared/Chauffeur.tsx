import { fetchListChauffeur } from "@/api/request/search/Chauffeur";
import { ThemedText } from "@/components/ThemedText";
import LoaderWithText from "@/components/ui/loaders/LoaderWithText";
import { useColorScheme } from "@/hooks/useColorScheme";
import useDebounce from "@/hooks/useDebounce";
import { Chauffeur, ChauffeurListResponse } from "@/types/search/Chauffeur";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";

export default function SearchScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const router = useRouter();
  const { redirect, currentFormData } = useLocalSearchParams<{
    currentFormData: string;
    redirect: string;
  }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchedWord = useDebounce(searchQuery, 500);

  const entityId = JSON.parse(currentFormData).entityId;

  const getChauffeurQuery = useQuery<ChauffeurListResponse>({
    queryKey: ["getChauffeurQuery", searchedWord, entityId],
    queryFn: fetchListChauffeur,
    enabled: !!entityId,
  });

  const handleSelect = (item: Chauffeur) => {
    const parsedForm = JSON.parse(currentFormData);

    const newFormValues = {
      ...parsedForm,

      driverId: item.id,
      driverName: item.name,
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
    if (getChauffeurQuery.isLoading) {
      return <LoaderWithText />;
    }

    if (getChauffeurQuery.isError) {
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
      (!getChauffeurQuery.data?.data ||
        getChauffeurQuery.data.data.length === 0)
    ) {
      return (
        <View style={styles.centeredContainer}>
          <ThemedText type="default" style={styles.statusText}>
            {`No se encontraron resultados para "${searchedWord}"`}{" "}
          </ThemedText>
        </View>
      );
    }

    return (
      <FlatList
        data={getChauffeurQuery.data?.data}
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
