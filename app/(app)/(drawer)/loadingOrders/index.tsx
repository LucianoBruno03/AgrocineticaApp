import { ThemedText } from "@/components/ThemedText";
import LoadingOrdersTableList from "@/components/ui/tables/LoadingOrdersTableList";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {};

const loadingOrder = (props: Props) => {
  return (
    <View style={styles.formContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titlePage}>
          Gestiona las ordenes de carga
        </ThemedText>
      </View>

      <View style={styles.tableContainer}>
        <LoadingOrdersTableList />
      </View>
    </View>
  );
};

export default loadingOrder;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 0,
    paddingTop: 20,
    gap: 12,
  },
  textButton: {
    fontSize: 60,
    color: "white",
    fontWeight: "bold",
    lineHeight: 62,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    textAlign: "center",
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  titlePage: {
    fontSize: 24,
    fontWeight: "bold",
  },
  titleContainer: {
    paddingInline: 20,
    width: "100%",
  },
  tableContainer: {
    width: "100%",
    flex: 1,
    gap: 12,
  },
});
