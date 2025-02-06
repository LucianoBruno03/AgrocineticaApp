import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import CustomRadioButton from "./CustomRadioButton";
import { usePagination } from "@/hooks/usePagination";
import { fetchListCategoriesType } from "@/api/request/search/CategoriesTypes";
import { UseFormReturn } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";

interface UnitType {
  id: string;
  name: string;
  active: boolean;
}

interface BusinessUnitType {
  businessId: string;
  typeUnitId: string;
  typeUnitName: string;
}

interface UnitTypesSelectionProps {
  onSelectedTypesChange: (selectedTypes: UnitType[]) => void;
  form: UseFormReturn<any> | null;
}

export default function UnitTypesList({
  onSelectedTypesChange,
  form,
}: UnitTypesSelectionProps) {
  const [selectedTypes, setSelectedTypes] = useState<UnitType[]>([]);
  const { data, isLoading, error, loadMore, refreshing, onRefresh } =
    usePagination<UnitType>({
      fetchFunction: async (page: number) => {
        const response = await fetchListCategoriesType({ queryKey: [page] });
        return {
          data: response.data,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          hasNextPage: response.hasNextPage,
        };
      },
    });

  useEffect(() => {
    if (form) {
      const formattedTypes: BusinessUnitType[] = selectedTypes.map((type) => ({
        businessId: "string",
        typeUnitId: type.id,
        typeUnitName: type.name,
      }));
      form.setValue("businessesUnitTypes", formattedTypes);
    }
    onSelectedTypesChange(selectedTypes);
  }, [selectedTypes, form]);

  const handleTypeSelection = (type: UnitType) => {
    setSelectedTypes((current) => {
      const isSelected = current.some((t) => t.id === type.id);
      if (isSelected) {
        return current.filter((t) => t.id !== type.id);
      } else {
        return [...current, type];
      }
    });
  };

  const renderItem = ({ item }: { item: UnitType }) => (
    <View style={styles.itemContainer}>
      <CustomRadioButton
        options={[{ value: item.id, label: item.name }]}
        selectedValue={
          selectedTypes.some((t) => t.id === item.id) ? item.id : ""
        }
        onSelect={() => handleTypeSelection(item)}
        selectedButtonStyle={{ backgroundColor: "transparent" }}
        selectedTextStyle={{ color: "#0093D1" }}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={isLoading ? <Text>Cargando...</Text> : null}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 200,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
