import { StyleSheet, Text, TextStyle, View } from "react-native";
import React from "react";
import { Pressable } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";

import { Colors } from "@/constants/Colors";
import { Business } from "@/types/business/searchBusiness";

const BusinessCardList = ({ item }: { item: Business }) => {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Pressable
      style={[
        styles.driverCard,
        item.businessStatusName !== "EN PROCESO" && styles.disabledCard,
        {
          backgroundColor:
            colorScheme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
      key={item.id}
      onPress={() => router.push(`/business/edit-business`)}
      disabled={item.businessStatusName !== "EN PROCESO"}
    >
      {/* <Text
        style={[
          styles.availability,
          item.isAvailable ? styles.available : styles.unavailable,
        ]}
      >
        {item.isAvailable ? "Disponible" : "No disponible"}
      </Text> */}

      <View style={styles.infoContainer}>
        <ThemedLabel>N°</ThemedLabel>
        <ThemedText style={styles.value}>{item.incrementId}</ThemedText>
      </View>

      <View style={styles.infoContainer}>
        <ThemedLabel>Origen</ThemedLabel>
        <ThemedText style={styles.value}>{item.firstLoadingPoint}</ThemedText>
      </View>

      <View style={styles.infoContainer}>
        <ThemedLabel>Destino</ThemedLabel>
        <ThemedText style={styles.value}>{item.lastUnloadingPoint}</ThemedText>
      </View>

      <View style={styles.infoContainer}>
        <ThemedLabel>Cliente</ThemedLabel>
        <ThemedText style={styles.value}>{item.entityBusinessName}</ThemedText>
      </View>

      <View style={styles.infoContainer}>
        <ThemedLabel>Producto</ThemedLabel>
        <ThemedText style={styles.value}>{item.itemName}</ThemedText>
      </View>

      <View style={styles.infoContainer}>
        <ThemedLabel>Tarifa transporte</ThemedLabel>
        <ThemedText style={styles.value}>{item.transportRate}</ThemedText>
      </View>

      <View style={styles.infoContainer}>
        <ThemedLabel>Tarifa cliente</ThemedLabel>
        <ThemedText style={styles.value}>{item.customerRate}</ThemedText>
      </View>

      <View style={styles.infoContainer}>
        <ThemedLabel>Comisión</ThemedLabel>
        <ThemedText style={styles.value}>{item.commission}</ThemedText>
      </View>
    </Pressable>
  );
};

export default BusinessCardList;

// const styles = StyleSheet.create({});

const styles = StyleSheet.create({
  driverCard: {
    // backgroundColor:
    //   colorScheme === "light"
    //     ? Colors.light.background
    //     : Colors.dark.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  disabledCard: {
    opacity: 0.6,
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
  infoContainer: {
    marginTop: 8,
  },

  label: {
    fontSize: 10,
    // color: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
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
