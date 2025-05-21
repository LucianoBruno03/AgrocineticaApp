import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";

import { CustomModal } from "@/components/customs/CustomModal";
import { Colors, statusColors } from "@/constants/Colors";
import { PurchaseOrders } from "@/types/purchaseOrders/SearchPurchaseOrders";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { router } from "expo-router";

import { Alert } from "react-native";
import { Linking } from "react-native";
import Toast from "react-native-toast-message";

const PurchaseOrdersCardList = ({
  item,
  isSelected,
  isSelectionMode,
  onLongPress,
}: {
  item: PurchaseOrders;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onLongPress?: () => void;
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const [showButtons, setShowButtons] = React.useState(false);
  const queryClient = useQueryClient();

  const handleEdit = () => {
    setShowButtons(false);
    router.navigate(`/purchaseOrders/edit/${item.id}`);
  };

  const handleShared = () => {
    setShowButtons(false);
    const url = `https://api.whatsapp.com/send?text=
    https://administracion.agrocinetica.com.ar/GenerarReporte.AShx?Tipo=25&ID_Orden=${item.incrementId}`;
    Linking.openURL(url).catch((err) =>
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo abrir la URL",
      })
    );
  };

  const handleViewDoc = () => {
    let url = `https://administracion.agrocinetica.com.ar/GenerarReporte.AShx?Tipo=25&ID_Orden=${item.incrementId}`;
    Linking.openURL(url).catch((err) =>
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo abrir la URL",
      })
    );
  };

  // const updateStateMutationAssigend = useMutation({
  //   mutationFn: fetchChangeStatePurchaseOrdersAssigned,
  //   onSuccess: () => {
  //     Toast.show({
  //       type: "success",
  //       text1: "Éxito",
  //       text2: "Estado actualizado correctamente",
  //     });
  //     setShowButtons(false);
  //     queryClient.refetchQueries({
  //       queryKey: ["getPurchaseOrdersListQuery"],
  //     });
  //   },
  //   onError: (error: Error | AxiosError) => {
  //     if (axios.isAxiosError(error)) {
  //       if (error.response?.status === 401) {
  //         Toast.show({
  //           type: "error",
  //           text1: "Error",
  //           text2: "Usuario o contraseña incorrectos",
  //         });
  //         return;
  //       }

  //       if (error.response?.status === 403) {
  //         Toast.show({
  //           type: "error",
  //           text1: "Error",
  //           text2: error.response?.data.message || "Acceso denegado",
  //         });
  //         return;
  //       }

  //       if (error.response?.status === 400) {
  //         Toast.show({
  //           type: "error",
  //           text1: "Error",
  //           text2: error.response?.data.message || "Hubo un error inesperado",
  //         });
  //         return;
  //       }

  //       if (error.response?.status === 404) {
  //         Toast.show({
  //           type: "error",
  //           text1: "Error",
  //           text2: `${
  //             error.response?.data.exception || "Hubo un error inesperado"
  //           }`,
  //         });
  //         return;
  //       }

  //       Toast.show({
  //         type: "error",
  //         text1: "Error",
  //         text2: "Hubo un error inesperado",
  //       });
  //     }
  //   },
  // });

  // const updateStateMutationCanceled = useMutation({
  //   mutationFn: fetchChangeStatePurchaseOrdersCanceled,
  //   onSuccess: () => {
  //     Toast.show({
  //       type: "success",
  //       text1: "Éxito",
  //       text2: "Estado actualizado correctamente",
  //     });
  //     setShowButtons(false);
  //     queryClient.refetchQueries({
  //       queryKey: ["getPurchaseOrdersListQuery"],
  //     });
  //   },
  //   onError: (error: Error | AxiosError) => {
  //     if (axios.isAxiosError(error)) {
  //       if (error.response?.status === 401) {
  //         Toast.show({
  //           type: "error",
  //           text1: "Error",
  //           text2: "Usuario o contraseña incorrectos",
  //         });
  //         return;
  //       }

  //       if (error.response?.status === 403) {
  //         Toast.show({
  //           type: "error",
  //           text1: "Error",
  //           text2: error.response?.data.message || "Acceso denegado",
  //         });
  //         return;
  //       }

  //       if (error.response?.status === 400) {
  //         Toast.show({
  //           type: "error",
  //           text1: "Error",
  //           text2: error.response?.data.message || "Hubo un error inesperado",
  //         });
  //         return;
  //       }

  //       if (error.response?.status === 404) {
  //         Toast.show({
  //           type: "error",
  //           text1: "Error",
  //           text2: `${
  //             error.response?.data.exception || "Hubo un error inesperado"
  //           }`,
  //         });
  //         return;
  //       }

  //       Toast.show({
  //         type: "error",
  //         text1: "Error",
  //         text2: "Hubo un error inesperado",
  //       });
  //     }
  //   },
  // });

  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={[
          styles.businessCard,

          item.purchaseOrderStatusName === "CANCELADO" && styles.disabledCard,
          {
            backgroundColor:
              colorScheme === "light"
                ? Colors.light.background
                : Colors.dark.background,
          },
          isSelected && styles.cardSelected,
        ]}
        key={item.id}
        onPress={() => {
          if (isSelectionMode) {
            onLongPress && onLongPress();
            return;
          }
          setShowButtons(!showButtons);
        }}
        onLongPress={onLongPress}
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
                statusColors[item.purchaseOrderStatusName] || "#fff",
            }}
          ></View>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Fecha</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.issuingDate
              ? dayjs(item.issuingDate).format("DD/MM/YYYY")
              : "Sin fecha"}
            {`${
              dayjs(item.issuingDate).isSame(dayjs(), "day")
                ? " (HOY)"
                : dayjs(item.issuingDate).isSame(dayjs().add(1, "day"), "day")
                ? " (MAÑANA)"
                : ""
            }`}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Transporte</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.loadingOrderEntityBusinessName}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Chofer</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.loadingOrderDriverName}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Chasis</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.loadingOrderChassisName}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Proveedor</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.entityBusinessName}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Remito</ThemedLabel>
          <ThemedText style={styles.value}>{item.remittanceNumber}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>OC</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.loadingOrderIncrementId}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Usuario</ThemedLabel>
          <ThemedText style={styles.value}>{item.userName}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Estado</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.purchaseOrderStatusName}
          </ThemedText>
        </View>

        <ThemedText style={styles.clickHint}>
          Click para acceder a opciones
        </ThemedText>
      </Pressable>
      {showButtons && (
        <CustomModal
          title="Opciones"
          visible={showButtons}
          onClose={() => setShowButtons(false)}
          withHeader={false}
        >
          <View style={styles.buttonList}>
            {item.purchaseOrderStatusName !== "CANCELADO" &&
              item.purchaseOrderStatusName !== "PENDIENTE" && (
                <Pressable onPress={handleEdit} style={styles.buttons}>
                  <ThemedText
                    style={{ fontWeight: "medium", color: "#007AFF" }}
                  >
                    Editar
                  </ThemedText>
                </Pressable>
              )}

            {/* {item.purchaseOrderStatusName == "PENDIENTE" && ( */}
            <Pressable onPress={handleShared} style={styles.buttons}>
              <ThemedText style={{ fontWeight: "medium", color: "#007AFF" }}>
                Compartir
              </ThemedText>
            </Pressable>
            {/* )} */}

            {/* {item.purchaseOrderStatusName == "PENDIENTE" && ( */}
            <Pressable onPress={handleViewDoc} style={styles.buttons}>
              <ThemedText style={{ fontWeight: "medium", color: "#007AFF" }}>
                Ver PDF
              </ThemedText>
            </Pressable>
            {/* )} */}

            <Pressable
              onPress={() => setShowButtons(false)}
              style={[styles.buttons]}
            >
              <ThemedText style={{ fontWeight: "medium", color: "red" }}>
                Cerrar
              </ThemedText>
            </Pressable>
          </View>
        </CustomModal>
      )}
    </View>
  );
};

export default PurchaseOrdersCardList;

// const styles = StyleSheet.create({});

const styles = StyleSheet.create({
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

  businessCard: {
    // backgroundColor:
    //   colorScheme === "light"
    //     ? Colors.light.background
    //     : Colors.dark.background,
    padding: 16,
    borderRadius: 12,
    gap: 8,
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
