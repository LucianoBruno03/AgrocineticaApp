import { ThemedText } from "@/components/ThemedText";
import { AddIcon } from "@/components/ui/icons/AddIcon";
import UnitsTableList from "@/components/ui/tables/UnitsTableList";
import { useAuthStore } from "@/zustand/authStore";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

const Units = () => {
  const { claims } = useAuthStore();

  return (
    <View style={styles.formContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titlePage}>Gestionar unidades</ThemedText>
      </View>

      {claims?.includes("Permissions.Unidades.Create") && (
        <Pressable
          style={styles.newButton}
          onPress={() => {
            router.push("/units/new");
          }}
        >
          <AddIcon
            width={40}
            height={40}
            color="white"
            style={styles.textButton}
          />
        </Pressable>
      )}

      <View style={styles.tableContainer}>
        {claims?.includes("Permissions.Unidades.View") ? (
          <UnitsTableList />
        ) : (
          <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
            No tienes permisos para ver esta sección.
          </ThemedText>
        )}
      </View>
    </View>
  );
};

export default Units;

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
  newButton: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "#ABCA48",
    borderRadius: 100,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    zIndex: 100,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    textAlign: "center",
    borderRadius: 100,
  },
  titlePage: {
    fontSize: 23,
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
