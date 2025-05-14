import { fetchSearchBusinessDetails } from "@/api/request/business/SearchBusinessDetails";
import { useColorScheme } from "@/hooks/useColorScheme";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import BusinessDetailsCardList from "../cards/BusinessDetailsCardList";
import { ThemedText } from "@/components/ThemedText";

const BusinessDetailsTableList = () => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchedWord = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [detailsList, setDetailsList] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const { idBusiness } = useLocalSearchParams<{ idBusiness: string }>();

  const getBusinessDetailsQuery = useQuery({
    queryKey: ["getBusinessDetailsListQuery", idBusiness, page],
    queryFn: fetchSearchBusinessDetails,
    staleTime: 5000,
  });

  useEffect(() => {
    if (getBusinessDetailsQuery.data?.data) {
      const newData = getBusinessDetailsQuery.data.data;
      const newTotal = getBusinessDetailsQuery.data.totalCount;

      if (page === 0) {
        setDetailsList(newData);
      } else {
        const currentIds = new Set(detailsList.map((item) => item.id));
        const uniqueNewItems = newData.filter(
          (item) => !currentIds.has(item.id)
        );
        setDetailsList((prev) => [...prev, ...uniqueNewItems]);
      }

      setTotalCount(newTotal);
    }
  }, [getBusinessDetailsQuery.data]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    setTotalCount(0);
    await getBusinessDetailsQuery.refetch();
    setRefreshing(false);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    const hasMoreToLoad = detailsList.length < totalCount;

    if (
      isCloseToBottom &&
      !getBusinessDetailsQuery.isFetching &&
      hasMoreToLoad
    ) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.containerList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {detailsList.length > 0 ? (
          detailsList.map((detail, index) => (
            <BusinessDetailsCardList
              key={`detail-${detail.id}-${index}`}
              item={detail}
            />
          ))
        ) : getBusinessDetailsQuery.isFetching ? (
          <View style={styles.noDataContainer}>
            <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <ThemedText style={styles.noDataThemedText}>
              No hay negocios para mostrar.
            </ThemedText>
          </View>
        )}

        {getBusinessDetailsQuery.isFetching && page > 0 && (
          <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
        )}

        {detailsList.length >= totalCount && detailsList.length > 0 && (
          <View style={styles.endListContainer}>
            <ThemedText style={styles.endListThemedText}>
              No hay más datos para mostrar.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default BusinessDetailsTableList;

const styles = StyleSheet.create({
  containerList: {
    width: "100%",
    gap: 16,
    paddingInline: 20,
    paddingBottom: 28,
  },
  noDataContainer: {
    alignItems: "center",
    padding: 16,
  },
  noDataThemedText: {
    fontSize: 18,
    color: "#888",
  },
  endListContainer: {
    alignItems: "center",
    padding: 16,
  },
  endListThemedText: {
    fontSize: 12,
    color: "#aaa",
  },
});
