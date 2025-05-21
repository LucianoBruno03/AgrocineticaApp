"use client";

import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { IconSymbol } from "../IconSymbol";

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
  // Animation value for press feedback
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const animatePress = (pressed: boolean) => {
    Animated.spring(scaleAnim, {
      toValue: pressed ? 0.98 : 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleEdit = () => {
    if (onEdit) onEdit(item);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(item);
  };

  // Determine if this is a cash item
  const isCashItem = item.itemName === "EFECTIVO";

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.itemInfo}>
        <View style={styles.nameContainer}>
          {/* Icon based on item type */}
          <View style={styles.iconContainer}>
            <Ionicons
              name={isCashItem ? "cash-outline" : "water-sharp"}
              size={18}
              color="#0093D1"
            />
          </View>
          <ThemedText style={styles.itemName}>{item.itemName}</ThemedText>
        </View>
        <View
          style={[
            styles.quantityContainer,
            isCashItem && styles.cashQuantityContainer,
          ]}
        >
          <ThemedText
            style={[styles.quantity, isCashItem && styles.cashQuantity]}
          >
            {isCashItem ? "$ " : ""}
            {item.quantity.toLocaleString("es-ES")}
            {item.unit ? ` ${item.unit}` : ""}
          </ThemedText>
        </View>
      </View>

      {(isEditable || isDeletable) && (
        <View style={styles.actions}>
          {isEditable && (
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.editButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleEdit}
              onPressIn={() => animatePress(true)}
              onPressOut={() => animatePress(false)}
            >
              <Ionicons name="pencil-sharp" size={18} color="white" />
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
              onPressIn={() => animatePress(true)}
              onPressOut={() => animatePress(false)}
            >
              <IconSymbol size={18} name="trash" color={"white"} />
            </Pressable>
          )}
        </View>
      )}
    </Animated.View>
  );
};

export default PurchaseOrderItemsCardList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 6,
    // backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    // elevation: 3,
    borderRightColor: "#3C3C3C80",
    borderBlockColor: "#3C3C3C80",
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: "#0093D1",
  },
  itemInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 40,
    backgroundColor: "#61616160",
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  itemName: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "600",
    flex: 1,
  },
  quantityContainer: {
    borderColor: "#0093D1",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  cashQuantityContainer: {
    borderColor: "#22C55E",
  },
  quantity: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0093D1",
  },
  cashQuantity: {
    color: "#22C55E",
  },
  actions: {
    flexDirection: "row",
    marginLeft: 16,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#0093D1",
  },
  deleteButton: {
    backgroundColor: "#e63946",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
