import { fetchSearchCategoriesTypes } from "@/api/request/categoriesTypes/SearchCategoriesTypes";
import { fetchSearchPurchaseOrders } from "@/api/request/purchaseOrders/SearchPurchaseOrders";
import { CustomTextField } from "@/components/customs/CustomTextField";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import useDebounce from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { z } from "zod";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import axios, { AxiosError } from "axios";
import PurchaseOrdersCardList from "../cards/PurchaseOrdersCardList";

const SearchSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
});

const PurchaseOrdersTableList = () => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchedWord = useDebounce(searchQuery, 500);
  const [selectedIds, setSelectedIds] = useState<Array<any>>([]);

  const form = useForm<z.infer<typeof SearchSchema>>({
    defaultValues: {
      search: "",
      type: "",
    },
  });

  const { control } = form;

  const getPurchaseOrdersQuery = useQuery({
    queryKey: ["getPurchaseOrdersListQuery", searchedWord, page],
    queryFn: fetchSearchPurchaseOrders,
    staleTime: 5000,
  });

  useEffect(() => {
    if (getPurchaseOrdersQuery.data?.data) {
      const newData = getPurchaseOrdersQuery.data.data;
      const newTotal = getPurchaseOrdersQuery.data.totalCount;

      // Siempre reemplazar cuando es página 0 (incluye refresh)
      if (page === 0) {
        setPurchaseOrders(newData);
      } else {
        const currentIds = new Set(purchaseOrders.map((item) => item.id));
        const uniqueNewItems = newData.filter(
          (item) => !currentIds.has(item.id)
        );
        setPurchaseOrders((prev) => [...prev, ...uniqueNewItems]);
      }

      setTotalCount(newTotal);
    }
  }, [getPurchaseOrdersQuery.data]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPurchaseOrders([]);
    setPage(0);
    await getPurchaseOrdersQuery.refetch();
    setRefreshing(false);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    const hasMoreToLoad = purchaseOrders.length < totalCount;

    if (
      isCloseToBottom &&
      !getPurchaseOrdersQuery.isFetching &&
      hasMoreToLoad
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSelect = (item: any) => {
    // Primero si ya existe lo quita sino lo agrega
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSelectedIds((prevIds) => {
      if (prevIds.includes(item.id)) {
        // Si ya está, lo quitamos
        return prevIds.filter((itemId) => itemId !== item.id);
      } else {
        // Si no está, lo agregamos
        return [...prevIds, item.id];
      }
    });
  };

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
                onChangeText={(value) => {
                  setSearchQuery(value);
                  setPage(0);
                  setTotalCount(0);
                  onChange(value);
                }}
                error={error}
                type="text"
                placeholder="Buscar por ordenes de compra"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="search"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.containerList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {!getPurchaseOrdersQuery.isRefetching && purchaseOrders.length === 0 ? (
          <View style={styles.noDataContainer}>
            <ThemedText style={styles.noDataText}>
              No hay ordenes de compra para mostrar.
            </ThemedText>
          </View>
        ) : (
          <>
            {purchaseOrders.map((item, index) => (
              <PurchaseOrdersCardList
                key={`order-${item.id}-${index}`}
                item={item}
                isSelected={selectedIds.some(
                  (selected) =>
                    selected === item.id ||
                    selected === item.purchaseOrderstatusName
                )}
                // onLongPress={() => handleSelect(item)}
                isSelectionMode={selectedIds.length > 0}
              />
            ))}

            {getPurchaseOrdersQuery.isFetching && page > 0 && (
              <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
            )}

            {purchaseOrders.length >= totalCount &&
              purchaseOrders.length > 0 && (
                <View style={styles.endListContainer}>
                  <ThemedText style={styles.endListText}>
                    No hay más datos para mostrar.
                  </ThemedText>
                </View>
              )}
          </>
        )}
      </ScrollView>
    </>
  );
};

export default PurchaseOrdersTableList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingInline: 20,
  },
  containerList: {
    width: "100%",
    gap: 16,
    paddingInline: 20,
    paddingBottom: 28,
  },
  searcher: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
  },
  endListContainer: {
    alignItems: "center",
    padding: 16,
  },
  endListText: {
    fontSize: 12,
    color: "#aaa",
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
});
