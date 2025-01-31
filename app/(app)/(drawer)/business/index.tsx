import { ThemedText } from "@/components/ThemedText";
import BusinessTableList from "@/components/ui/tables/BusinessTableList";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {};

const bussines = (props: Props) => {
  return (
    <View style={styles.formContainer}>
      <Pressable
        style={styles.newButton}
        onPress={() => {
          router.push("/business/new-business");
        }}
      >
        <Text style={styles.textButton}>+</Text>
      </Pressable>
      <ThemedText style={styles.titlePage}>Gestiona los negocios</ThemedText>

      <View style={{ width: "100%", flex: 1 }}>
        <BusinessTableList />
      </View>
    </View>
  );
};

export default bussines;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
    backgroundColor: "#19191920",
    width: "100%",
  },
  newButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
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
    marginBottom: 16,
  },
});
