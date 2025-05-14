import AddAvailablePlaces from "@/components/business/AddAvailablePlaces";
import { CustomModal } from "@/components/customs/CustomModal";
import { ThemedText } from "@/components/ThemedText";
import BusinessDetailsTableList from "@/components/ui/tables/BusinessDetailsTableList";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {};

const ViewBusiness = (props: Props) => {
  const [Open, setOpen] = useState(false);

  return (
    <View style={styles.formContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titlePage}>Gestiona los cupos</ThemedText>
      </View>

      <Pressable
        style={styles.newButton}
        onPress={() => {
          setOpen(true);
        }}
      >
        <Text style={styles.textButton}>+</Text>
      </Pressable>

      <CustomModal
        title="Generar cupo"
        visible={Open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <AddAvailablePlaces />
      </CustomModal>

      <View style={styles.tableContainer}>
        <BusinessDetailsTableList />
      </View>
    </View>
  );
};

export default ViewBusiness;

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
