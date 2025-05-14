import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import PurchaseOrdersItemsModal from "./PurchaseOrdersItemsModal";
import { ThemedText } from "../ThemedText";
import Toast from "react-native-toast-message";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAddPurchaseOrderItem } from "@/api/request/purchaseOrders/AddPurchaseOrderItem";
import { fetchSearchPurchaseOrderItems } from "@/api/request/purchaseOrders/SearchPurchaseOrderItems";
import PurchaseOrderItemsCardList from "../ui/cards/PurchaseOrderItemsCardList";
import { fetchEditPurchaseOrderItem } from "@/api/request/purchaseOrders/EditPurchaseOrderItem";

type Props = {
  idPurchaseOrder: string;
};

const PurchaseOrdersItems = ({ idPurchaseOrder }: Props) => {
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [itemToEdit, setItemToEdit] = React.useState<any>(null);

  const queryClient = useQueryClient();

  const getPurchaseOrderItemsByOrderQuery = useQuery({
    queryKey: ["getPurchaseOrderItemsByOrderQuery", idPurchaseOrder],
    queryFn: fetchSearchPurchaseOrderItems,
    enabled: !!idPurchaseOrder,
  });

  const addItemMutation = useMutation({
    mutationFn: fetchAddPurchaseOrderItem,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getPurchaseOrderItemsByOrderQuery"],
      });
    },
    onError: (error: Error | AxiosError) => {
      handleApiError(error);
    },
  });

  const editItemMutation = useMutation({
    mutationFn: fetchEditPurchaseOrderItem,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getPurchaseOrderItemsByOrderQuery"],
      });
    },
    onError: (error: Error | AxiosError) => {
      handleApiError(error);
    },
  });

  const handleApiError = (error: Error | AxiosError) => {
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
  };

  const handleAddItem = (data: any) => {
    addItemMutation.mutate(data);
    setAddModalOpen(false);
  };

  const handleEditItem = (data: any) => {
    editItemMutation.mutate({
      data: {
        id: itemToEdit.id,
        purchaseOrderId: idPurchaseOrder,
        itemId: data.itemId,
        quantity: data.quantity,
      },
      id: itemToEdit.id,
    });
    setEditModalOpen(false);
  };

  const handleEditClick = (item: any) => {
    setItemToEdit(item);
    setEditModalOpen(true);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.containerSubtitle}>
        <View style={styles.itemsTitle}>
          <ThemedText style={styles.subtitle}>Items</ThemedText>
          <Pressable
            style={styles.newButton}
            onPress={() => setAddModalOpen(true)}
          >
            <Text style={styles.textButton}>+</Text>
          </Pressable>
        </View>
        <View style={styles.separator}></View>
      </View>

      {/* Modal para agregar items */}
      <PurchaseOrdersItemsModal
        open={addModalOpen}
        setOpen={setAddModalOpen}
        onSubmit={handleAddItem}
        purchaseOrderId={idPurchaseOrder}
      />

      {/* Modal para editar items */}
      <PurchaseOrdersItemsModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        onSubmit={handleEditItem}
        initialData={itemToEdit}
        isEditing={true}
        purchaseOrderId={idPurchaseOrder}
      />

      {getPurchaseOrderItemsByOrderQuery.data?.data ? (
        <View style={{ width: "100%", gap: 8, flexDirection: "column" }}>
          {getPurchaseOrderItemsByOrderQuery.data?.data.map(
            (item: any, index) => (
              <PurchaseOrderItemsCardList
                item={item}
                key={index}
                isDeletable={false}
                isEditable={true}
                onEdit={() => handleEditClick(item)}
                onDelete={() => {
                  // Implementar eliminación si es necesario
                }}
              />
            )
          )}
        </View>
      ) : (
        <ThemedText
          style={{ color: "red", width: "100%", textAlign: "center" }}
        >
          No hay items seleccionados
        </ThemedText>
      )}
    </View>
  );
};

export default PurchaseOrdersItems;

const styles = StyleSheet.create({
  separator: {
    height: 2,
    width: "100%",
    backgroundColor: "#ABCA48",
  },
  containerSubtitle: {
    flexDirection: "column",
    gap: 2,
    width: "100%",
  },
  addButton: {
    backgroundColor: "#ABCA48",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBlock: 4,
  },
  newButton: {
    right: 14,
    backgroundColor: "#ABCA48",
    borderRadius: 100,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    zIndex: 100,
  },
  textButton: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    lineHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    textAlign: "center",
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  itemsTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    gap: 16,
  },
});
