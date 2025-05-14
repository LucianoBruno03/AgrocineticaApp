import { fetchSearchBusiness } from "@/api/request/business/SearchBusiness";
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
import useDebounce from "@/hooks/useDebounce";
import BusinessCardList from "../cards/BusinessCardList";
import { ThemedText } from "@/components/ThemedText";

const SearchSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
});

const BusinessTableList = () => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchedWord = useDebounce(searchQuery, 500);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [businessList, setBusinessList] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const form = useForm<z.infer<typeof SearchSchema>>({
    defaultValues: {
      search: "",
      type: "",
    },
  });

  const { control } = form;

  const getBusinessQuery = useQuery({
    queryKey: ["getBusinessListQuery", searchedWord, page],
    queryFn: fetchSearchBusiness,
    staleTime: 5000,
  });

  useEffect(() => {
    if (getBusinessQuery.data?.data) {
      const newData = getBusinessQuery.data.data;
      const newTotal = getBusinessQuery.data.totalCount;

      if (page === 0) {
        setBusinessList(newData);
      } else {
        const currentIds = new Set(businessList.map((item) => item.id));
        const uniqueNewItems = newData.filter(
          (item) => !currentIds.has(item.id)
        );
        setBusinessList((prev) => [...prev, ...uniqueNewItems]);
      }

      setTotalCount(newTotal);
    }
  }, [getBusinessQuery.data]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    setTotalCount(0);
    await getBusinessQuery.refetch();
    setRefreshing(false);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    const hasMoreToLoad = businessList.length < totalCount;

    if (isCloseToBottom && !getBusinessQuery.isFetching && hasMoreToLoad) {
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
                placeholder="Buscar por negocios"
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
        {businessList.length > 0 ? (
          businessList.map((business, index) => (
            <BusinessCardList
              key={`business-${business.id}-${index}`}
              item={business}
            />
          ))
        ) : getBusinessQuery.isFetching ? (
          <View style={styles.noDataContainer}>
            <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <ThemedText style={styles.noDataText}>
              No hay negocios para mostrar.
            </ThemedText>
          </View>
        )}

        {getBusinessQuery.isFetching && page > 0 && (
          <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
        )}

        {businessList.length >= totalCount && businessList.length > 0 && (
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

export default BusinessTableList;

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
  textInput: {
    padding: 10,
    paddingStart: 20,
    height: 48,
  },
  noDataContainer: {
    alignItems: "center",
    padding: 16,
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
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
