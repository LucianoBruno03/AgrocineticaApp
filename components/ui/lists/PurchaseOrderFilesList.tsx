import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Pressable,
  Linking,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import axios, { AxiosError } from "axios";
import { CustomConfirmAction } from "@/components/customs/CustomConfirmAction";
import { fetchSearchPurchaseOrderFiles } from "@/api/request/purchaseOrders/SearchPurchaseOrderFiles";
import { fetchDeletePurchaseOrderFile } from "@/api/request/purchaseOrders/DeletePurchaseOrderFile";
import { PurchaseOrderFiles } from "@/types/purchaseOrders/SearchPurchaseOrders";

const PurchaseOrderFilesList = ({
  idPurchaseOrder,
}: {
  idPurchaseOrder: string;
}) => {
  const queryClient = useQueryClient();

  const getPurchaseOrderFilesQuery = useQuery({
    queryKey: ["getPurchaseOrderFilesListQuery", idPurchaseOrder],
    queryFn: fetchSearchPurchaseOrderFiles,
    enabled: !!idPurchaseOrder,
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: fetchDeletePurchaseOrderFile,
    onSuccess: () => {
      // Toast.show({
      //   type: "success",
      //   text1: "Éxito",
      //   text2: "Archivo eliminado correctamente",
      // });
      queryClient.refetchQueries({
        queryKey: ["getPurchaseOrderFilesListQuery"],
      });
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

  const handleDelete = (id: string) => {
    deleteDocumentMutation.mutate({ id });
  };

  const handleView = (url: string) => {
    Linking.openURL(url).catch((err) =>
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo abrir la URL",
      })
    );
  };

  return (
    <View style={styles.container}>
      {getPurchaseOrderFilesQuery.isLoading && (
        <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
      )}
      {getPurchaseOrderFilesQuery.isError && (
        <ThemedText>
          Error: {getPurchaseOrderFilesQuery.error.message}
        </ThemedText>
      )}
      {getPurchaseOrderFilesQuery.isSuccess && (
        <View style={styles.listContainer}>
          {Array.isArray(getPurchaseOrderFilesQuery.data.data) &&
            getPurchaseOrderFilesQuery.data.data.map(
              (item: PurchaseOrderFiles) => (
                <View key={item.id} style={styles.card}>
                  <ThemedText style={styles.itemName}>{item.name}</ThemedText>

                  {item.filePath && (
                    <Image
                      source={{
                        uri:
                          "https://api.agrocinetica.goodapps.com.ar/" +
                          item.filePath,
                      }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  )}

                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={[styles.actionButton, styles.viewButton]}
                      onPress={() =>
                        handleView(
                          "https://api.agrocinetica.goodapps.com.ar/" +
                            item.filePath
                        )
                      }
                    >
                      <Ionicons name="eye-outline" size={20} color="white" />
                      <ThemedText style={styles.actionButtonText}>
                        Ver
                      </ThemedText>
                    </Pressable>

                    <View style={[styles.actionButton, styles.deleteButton]}>
                      <CustomConfirmAction
                        onConfirm={() => handleDelete(item.id)}
                        message="¿Deseás eliminar este documento?"
                        description="Este documento se eliminará permanentemente."
                      >
                        <View
                          style={[styles.actionButton, styles.deleteButton]}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="white"
                          />
                          <ThemedText style={styles.actionButtonText}>
                            Eliminar
                          </ThemedText>
                        </View>
                      </CustomConfirmAction>
                    </View>
                  </View>
                </View>
              )
            )}
        </View>
      )}
    </View>
  );
};

export default PurchaseOrderFilesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#0093D150",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#0093D110",
    gap: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: "#0093D1", // azul
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#e63946",
  },
  actionButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
});
