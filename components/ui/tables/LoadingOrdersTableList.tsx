import { CustomTextField } from "@/components/customs/CustomTextField";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { z } from "zod";
import { fetchSearchLoadingOrders } from "@/api/request/loadingOrders/SearchLoadingOrders";
import useDebounce from "@/hooks/useDebounce";
import LoadingOrdersCardList from "../cards/LoadingOrdersCardList";
import { ThemedText } from "@/components/ThemedText";

const SearchSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
});

const LoadingOrdersTableList = () => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchedWord = useDebounce(searchQuery, 500);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const form = useForm<z.infer<typeof SearchSchema>>({
    defaultValues: {
      search: "",
      type: "",
    },
  });

  const { control } = form;

  const getLoadingOrdersQuery = useQuery({
    queryKey: ["getLoadingOrdersListQuery", searchedWord, page],
    queryFn: fetchSearchLoadingOrders,
    staleTime: 5000,
  });

  useEffect(() => {
    if (getLoadingOrdersQuery.data?.data) {
      const newData = getLoadingOrdersQuery.data.data;
      const newTotal = getLoadingOrdersQuery.data.totalCount;

      // Siempre reemplazar cuando es página 0 (incluye refresh)
      if (page === 0) {
        setLoadingOrders(newData);
      } else {
        const currentIds = new Set(loadingOrders.map((item) => item.id));
        const uniqueNewItems = newData.filter(
          (item) => !currentIds.has(item.id)
        );
        setLoadingOrders((prev) => [...prev, ...uniqueNewItems]);
      }

      setTotalCount(newTotal);
    }
  }, [getLoadingOrdersQuery.data]);

  const onRefresh = async () => {
    setRefreshing(true);
    setLoadingOrders([]);
    setPage(0);
    await getLoadingOrdersQuery.refetch();
    setRefreshing(false);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    const hasMoreToLoad = loadingOrders.length < totalCount;

    if (isCloseToBottom && !getLoadingOrdersQuery.isFetching && hasMoreToLoad) {
      setPage((prev) => prev + 1);
    }
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
                placeholder="Buscar por ordenes de carga"
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
        {loadingOrders.length > 0 ? (
          loadingOrders.map((loadingOrder, index) => (
            <LoadingOrdersCardList
              key={`order-${loadingOrder.id}-${index}`}
              item={loadingOrder}
            />
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <ThemedText style={styles.noDataText}>
              No hay ordenes de carga para mostrar.
            </ThemedText>
          </View>
        )}

        {getLoadingOrdersQuery.isFetching && page > 0 && (
          <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
        )}

        {loadingOrders.length >= totalCount && loadingOrders.length > 0 && (
          <View style={styles.endListContainer}>
            <ThemedText style={styles.endListText}>
              No hay más datos para mostrar.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default LoadingOrdersTableList;

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
});
