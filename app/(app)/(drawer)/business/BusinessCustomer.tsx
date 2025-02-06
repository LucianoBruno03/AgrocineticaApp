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
import { fetchListBusinessCustomer } from "@/api/request/search/BusinessCustomer";
import {
  BusinessCustomer,
  BusinessCustomerListResponse,
} from "@/types/search/BusinessCustomer";
import useDebounce from "@/hooks/useDebounce";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export default function SearchScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const router = useRouter();
  const { currentFormData } = useLocalSearchParams<{
    currentFormData: string;
  }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchedWord = useDebounce(searchQuery, 500);

  const getBusinessCustomerQuery = useQuery<BusinessCustomerListResponse>({
    queryKey: ["getBusinessCustomerQuery", searchedWord],
    queryFn: fetchListBusinessCustomer,
  });

  const handleSelect = (item: BusinessCustomer) => {
    const parsedForm = JSON.parse(currentFormData);

    const newFormValues = {
      ...parsedForm,

      businessUserId: item.id,
      businessUserName: item.fullName,
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
    if (getBusinessCustomerQuery.isLoading) {
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

    if (getBusinessCustomerQuery.isError) {
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
      (!getBusinessCustomerQuery.data?.data ||
        getBusinessCustomerQuery.data.data.length === 0)
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
        data={getBusinessCustomerQuery.data?.data}
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
              {item.fullName}
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
