import { fetchSearchCategoriesTypes } from "@/api/request/categoriesTypes/SearchCategoriesTypes";
import { fetchSearchLoadingOrders } from "@/api/request/loadingOrders/SearchLoadingOrders";
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
import LoadingOrdersCardList from "../cards/LoadingOrdersCardList";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import axios, { AxiosError } from "axios";
import { fetchChangeStateLoadingOrdersDownloaded } from "@/api/request/loadingOrders/ChangeStateLoadingOrders";

const SearchSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
});

const LoadingOrdersTableListSelection = () => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState<any[]>([]);
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

  const { data: LoadingOrderStates } = useQuery({
    queryKey: [
      "getStatusChangeStateLoadingOrder",
      "",
      "ESTADOS ORDEN DE CARGA",
    ],
    queryFn: () =>
      fetchSearchCategoriesTypes({
        queryKey: [
          "getStatusChangeStateLoadingOrder",
          "",
          "ESTADOS ORDEN DE CARGA",
          [],
        ],
      }),
  });

  const getLoadingOrdersQuery = useQuery({
    queryKey: [
      "getLoadingOrdersListAsignedQuery",
      searchedWord,
      page,
      ["loadingOrderStatusId"],
      LoadingOrderStates?.data?.find((item) => item.name === "ASIGNADO")?.id,
    ],
    queryFn: fetchSearchLoadingOrders,
    staleTime: 5000,
    enabled: !!LoadingOrderStates?.data,
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

  const handleSelectLoadingOrder = (loadingOrder: any) => {
    // Primero si ya existe lo quita sino lo agrega
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSelectedIds((prevIds) => {
      if (prevIds.includes(loadingOrder.id)) {
        // Si ya está, lo quitamos
        return prevIds.filter((itemId) => itemId !== loadingOrder.id);
      } else {
        // Si no está, lo agregamos
        return [...prevIds, loadingOrder.id];
      }
    });
  };

  const changeStatusMutation = useMutation({
    mutationFn: fetchChangeStateLoadingOrdersDownloaded,
    onSuccess: async (data) => {
      try {
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Ordenes de carga actualizadas correctamente",
        });
        router.replace("/loadingOrders");
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error al guardar los datos de la orden de carga",
        });
      }
    },
    onError: (error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Usuario o contraseña incorrectos",
          });
          return;
        }

        if (error.response?.status === 403) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.response?.data.message || "Acceso denegado",
          });
          return;
        }

        if (error.response?.status === 400) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.response?.data.message || "Hubo un error inesperado",
          });
          return;
        }

        if (error.response?.status === 404) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: `${
              error.response?.data.exception || "Hubo un error inesperado"
            }`,
          });
          return;
        }

        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Hubo un error inesperado",
        });
      }
    },
  });

  const handleChangeStatus = async () => {
    // Cambia el estado de las ordenes de carga seleccionadas
    let data = {
      loadingOrderIds: selectedIds,
    };

    changeStatusMutation.mutateAsync({
      data,
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

      {selectedIds.length > 0 && (
        <Pressable
          onPress={() => handleChangeStatus()}
          style={[
            styles.saveButton,
            {
              opacity: selectedIds.length > 0 ? 1 : 0.5,
              backgroundColor: selectedIds.length > 0 ? "#0093D1" : "#a0a0a0",
            },
          ]}
          disabled={selectedIds.length === 0}
        >
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: selectedIds.length > 0 ? "white" : "gray",
            }}
          >
            Actualizar ({selectedIds.length})
          </ThemedText>
        </Pressable>
      )}

      <ScrollView
        contentContainerStyle={styles.containerList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {!getLoadingOrdersQuery.isRefetching && loadingOrders.length === 0 ? (
          <View style={styles.noDataContainer}>
            <ThemedText style={styles.noDataText}>
              No hay ordenes de carga para mostrar.
            </ThemedText>
          </View>
        ) : (
          <>
            {loadingOrders.map((loadingOrder, index) => (
              <LoadingOrdersCardList
                key={`order-${loadingOrder.id}-${index}`}
                item={loadingOrder}
                isSelected={selectedIds.some(
                  (selected) =>
                    selected === loadingOrder.id ||
                    selected === loadingOrder.loadingOrderStatusName
                )}
                onLongPress={() => handleSelectLoadingOrder(loadingOrder)}
                isSelectionMode={selectedIds.length > 0}
              />
            ))}

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
          </>
        )}
      </ScrollView>
    </>
  );
};

export default LoadingOrdersTableListSelection;

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
