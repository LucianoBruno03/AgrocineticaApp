import { fetchSearchLoadingOrders } from "@/api/request/loadingOrders/SearchLoadingOrders";
import { ThemedText } from "@/components/ThemedText";
import LoaderWithText from "@/components/ui/loaders/LoaderWithText";
import { Colors, statusColors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import useDebounce from "@/hooks/useDebounce";
import { LoadingOrders } from "@/types/loadingOrders/SearchLoadingOrders";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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

  const getLoadingOrdersQuery = useQuery({
    queryKey: [
      "getLoadingOrdersSelectionIdListQuery",
      searchedWord,
      0,
      [],
      "",
      100,
      true,
    ],
    queryFn: fetchSearchLoadingOrders,
    staleTime: 5000,
  });

  const handleSelect = (item: LoadingOrders) => {
    const parsedForm = JSON.parse(currentFormData);

    const newFormValues = {
      ...parsedForm,

      // entityId: item.id,
      // entityBusinessName: item.businessName,

      [formFieldId]: item.id,
      [formFieldName]: item.incrementId,

      remittanceNumber: item.remittanceNumber,
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
    if (getLoadingOrdersQuery.isLoading) {
      return <LoaderWithText />;
    }

    if (getLoadingOrdersQuery.isError) {
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
      (!getLoadingOrdersQuery.data?.data ||
        getLoadingOrdersQuery.data.data.length === 0)
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
        data={getLoadingOrdersQuery.data?.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // <Pressable
          //   onPress={() => handleSelect(item)}
          //   style={[
          //     styles.listItem,
          //     {
          //       borderBottomColor:
          //         colorScheme === "light" ? "#28282850" : "#444",
          //     },
          //   ]}
          // >

          <Pressable
            style={[
              styles.card,

              {
                backgroundColor:
                  colorScheme === "light"
                    ? Colors.light.background
                    : Colors.dark.background,
              },
            ]}
            key={item.id}
            onPress={() => {
              handleSelect(item);
            }}
          >
            <View
              style={[
                styles.infoContainer,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "space-between",
                },
              ]}
            >
              <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>
                N° {item.incrementId}
              </ThemedText>
              <View
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  borderColor: "#79797950",
                  borderWidth: 0.5,
                  backgroundColor:
                    statusColors[item.loadingOrderStatusName] || "#fff",
                }}
              ></View>
            </View>

            <View style={styles.infoContainer}>
              <ThemedLabel>Fecha de carga</ThemedLabel>
              <ThemedText style={styles.value}>
                {item.loadDate
                  ? dayjs(item.loadDate).format("DD/MM/YYYY")
                  : "Sin fecha"}
                {`${
                  dayjs(item.loadDate).isSame(dayjs(), "day")
                    ? " (HOY)"
                    : dayjs(item.loadDate).isSame(dayjs().add(1, "day"), "day")
                    ? " (MAÑANA)"
                    : ""
                }`}
              </ThemedText>
            </View>

            <View style={styles.infoContainer}>
              <ThemedLabel>Cliente</ThemedLabel>
              <ThemedText style={styles.value}>
                {item.businessDetailBusinessEntityBusinessName}
              </ThemedText>
            </View>

            <View style={styles.infoContainer}>
              <ThemedLabel>Razón social del transporte</ThemedLabel>
              <ThemedText style={styles.value}>
                {item.entityBusinessName}
              </ThemedText>
            </View>

            <View style={styles.infoContainer}>
              <ThemedLabel>Chofer</ThemedLabel>
              <ThemedText style={styles.value}>{item.driverName}</ThemedText>
            </View>

            <View style={styles.infoContainer}>
              <ThemedLabel>Chasis</ThemedLabel>
              <ThemedText style={styles.value}>{item.chassisName}</ThemedText>
            </View>

            <View style={styles.infoContainer}>
              <ThemedLabel>Trailer</ThemedLabel>
              <ThemedText style={styles.value}>{item.trailerName}</ThemedText>
            </View>

            <View style={styles.infoContainer}>
              <ThemedLabel>Origen</ThemedLabel>
              <ThemedText style={styles.value}>
                {item.businessDetailBusinessFirstLoadingPoint}
              </ThemedText>
            </View>

            <View style={styles.infoContainer}>
              <ThemedLabel>Destino</ThemedLabel>
              <ThemedText style={styles.value}>
                {item.businessDetailBusinessLastUnloadingPoint}
              </ThemedText>
            </View>
            {/* 
            <ThemedText style={styles.clickHint}>
              Click para acceder a opciones
            </ThemedText> */}
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
    flexDirection: "column",
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
  cardContainer: {
    position: "relative", // Asegura que el botón flotante se posicione relativo a este contenedor
    overflow: "hidden", // Para que el botón flotante no se vea fuera del contenedor
  },
  buttons: {
    padding: 8,
    borderRadius: 12,
    color: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonList: {
    width: "100%",
    flexDirection: "column",
    gap: 5,
  },
  disabledCard: {
    opacity: 0.6,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  clickHint: {
    fontSize: 10,
    opacity: 0.5,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
  },

  card: {
    // backgroundColor:
    //   colorScheme === "light"
    //     ? Colors.light.background
    //     : Colors.dark.background,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginVertical: 12,
  },

  availability: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  available: {
    color: "green",
  },
  unavailable: {
    color: "red",
  },

  flex: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: 10,
    // color: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
  },
  value: {
    flex: 1,
    overflow: "hidden",
    marginLeft: "auto",
    textAlign: "right",

    fontSize: 14,
    fontWeight: "bold",
  },
  cardSelected: {
    borderColor: "#ABCA48",
    borderWidth: 2,
    backgroundColor: "#ABCA4850",
  },
});

const ThemedLabel = ({ children }: { children: string }) => {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Text
      style={[
        styles.label,
        {
          color: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
        },
      ]}
    >
      {children}
    </Text>
  );
};
