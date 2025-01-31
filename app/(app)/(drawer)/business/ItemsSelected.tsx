import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchListItems } from "@/api/request/dropdown/ItemsDropdown";
import { Items, ItemsListResponse } from "@/types/dropdown/ItemsDropdown";
import useDebounce from "@/hooks/useDebounce";

export default function SearchScreen() {
  const router = useRouter();
  const { currentFormData } = useLocalSearchParams<{
    currentFormData: string;
  }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchedWord = useDebounce(searchQuery, 500);

  const getItemsQuery = useQuery<ItemsListResponse>({
    queryKey: ["getItemsQuery", searchedWord],
    queryFn: fetchListItems,
  });

  const handleSelect = (item: Items) => {
    const parsedForm = JSON.parse(currentFormData);

    const newFormValues = {
      ...parsedForm,
      itemId: item.id,
      itemName: item.name,
    };

    const newFormData = JSON.stringify(newFormValues);

    // Volver atrás en la navegación antes de reemplazar
    router.back();

    // Pequeño delay para asegurarnos de que back se procesa antes del replace
    router.replace({
      pathname: "/business/new-business",
      params: {
        currentFormData: newFormData,
      },
    });
  }; // Delay corto para evitar conflictos de navegación

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Buscar..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        autoFocus
      />

      <FlatList
        data={getItemsQuery.data?.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={{ padding: 15, borderBottomWidth: 1 }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
