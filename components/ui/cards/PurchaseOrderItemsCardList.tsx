import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { IconSymbol } from "../IconSymbol";
import { Ionicons } from "@expo/vector-icons";

type PurchaseOrderItem = {
  id: string;
  itemName: string;
  quantity: number;
  unit?: string;
};

type Props = {
  item: PurchaseOrderItem;
  onEdit?: (item: PurchaseOrderItem) => void;
  onDelete?: (item: PurchaseOrderItem) => void;
  isEditable?: boolean;
  isDeletable?: boolean;
};

const PurchaseOrderItemsCardList = ({
  item,
  onEdit,
  onDelete,
  isEditable = false,
  isDeletable = false,
}: Props) => {
  // Empty functions that will be implemented later
  const handleEdit = () => {
    if (onEdit) onEdit(item);
    // You can implement the edit functionality here later
  };

  const handleDelete = () => {
    if (onDelete) onDelete(item);
    // You can implement the delete functionality here later
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemInfo}>
        <ThemedText style={styles.itemName}>{item.itemName}</ThemedText>
        <View style={styles.quantityContainer}>
          <ThemedText style={styles.quantity}>
            {item.itemName == "EFECTIVO" ? "$ " : ""}
            {item.quantity.toLocaleString("es-ES")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actions}>
        {isEditable && (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleEdit}
          >
            <Ionicons name="pencil-sharp" size={24} color="white" />
          </Pressable>
        )}

        {isDeletable && (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleDelete}
          >
            <IconSymbol size={24} name="trash" color={"white"} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default PurchaseOrderItemsCardList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  quantityContainer: {
    backgroundColor: "#0093D120",
    borderColor: "#0093D180",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quantity: {
    fontSize: 14,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    marginLeft: 16,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#0093D1",
    // backgroundColor: "#ABCA48",
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: "#e63946",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
