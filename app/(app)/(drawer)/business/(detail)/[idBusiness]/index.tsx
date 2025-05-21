import AddAvailablePlaces from "@/components/business/AddAvailablePlaces";
import { CustomModal } from "@/components/customs/CustomModal";
import { ThemedText } from "@/components/ThemedText";
import { AddIcon } from "@/components/ui/icons/AddIcon";
import BusinessDetailsTableList from "@/components/ui/tables/BusinessDetailsTableList";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

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
        <AddIcon
          width={40}
          height={40}
          color="white"
          style={styles.textButton}
        />
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
