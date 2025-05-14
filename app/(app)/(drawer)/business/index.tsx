import { ThemedText } from "@/components/ThemedText";
import BusinessTableList from "@/components/ui/tables/BusinessTableList";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {};

const business = (props: Props) => {
  return (
    <View style={styles.formContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titlePage}>Gestiona los negocios</ThemedText>
      </View>

      <Pressable
        style={styles.newButton}
        onPress={() => {
          router.push("/business/new-business");
        }}
      >
        <Text style={styles.textButton}>+</Text>
      </Pressable>

      <View style={styles.tableContainer}>
        <BusinessTableList />
      </View>
    </View>
  );
};

export default business;

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
