import { useColorScheme } from "@/hooks/useColorScheme.web";
import React from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";

import { Colors } from "@/constants/Colors";
import { Business } from "@/types/business/SearchBusiness";
import dayjs from "dayjs";
import { router } from "expo-router";

const BusinessCardList = ({ item }: { item: Business }) => {
  const colorScheme = useColorScheme() ?? "light";
  const [showButtons, setShowButtons] = React.useState(false);

  const handleEdit = () => {
    router.navigate(`/business/edit/${item.id}`);
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={[
          styles.businessCard,
          item.businessStatusName == "CANCELADO" && styles.disabledCard,
          {
            backgroundColor:
              colorScheme === "light"
                ? Colors.light.background
                : Colors.dark.background,
          },
        ]}
        key={item.id}
        onPress={() => setShowButtons(!showButtons)}
        disabled={item.businessStatusName == "CANCELADO"}
      >
        <View
          style={[
            styles.infoContainer,
            {
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              justifyContent: "space-between",
            },
          ]}
        >
          <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>
            N° {item.incrementId}
          </ThemedText>
          <View
            style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderColor: "#79797950",
              borderWidth: 0.5,
              backgroundColor:
                item.businessStatusName == "CANCELADO"
                  ? "red"
                  : item.businessStatusName == "ACTIVO"
                  ? "blue"
                  : item.businessStatusName == "GENERADO"
                  ? "yellow"
                  : item.businessStatusName == "ASIGNADO"
                  ? "orange"
                  : item.businessStatusName == "CUBIERTO"
                  ? "green"
                  : item.businessStatusName == "CUBIERTO PARCIAL"
                  ? "lightgreen"
                  : item.businessStatusName == "CUBIERTO POR EL CLIENTE"
                  ? "darkgreen"
                  : "gray",
            }}
          ></View>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Fecha de carga</ThemedLabel>
          <ThemedText style={styles.value}>
            {dayjs(item.loadDate).format("DD/MM/YYYY")}
            {`${
              dayjs(item.loadDate).isSame(dayjs(), "day")
                ? " (HOY)"
                : dayjs(item.loadDate).isSame(dayjs().add(1, "day"), "day")
                ? " (MAÑANA)"
                : ""
            }`}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Origen</ThemedLabel>
          <ThemedText style={styles.value}>{item.firstLoadingPoint}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Destino</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.lastUnloadingPoint}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Cliente</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.entityBusinessName}
          </ThemedText>
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

        <View style={styles.infoContainer}>
          <ThemedLabel>Usuario</ThemedLabel>
          <ThemedText style={styles.value}>{item.businessUserName}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Cupos</ThemedLabel>
          <ThemedText style={styles.value}>{item.quantity}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Cupos incompletos</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.incompleteQuantity}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Estado</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.businessStatusName}
          </ThemedText>
        </View>

        <ThemedText style={styles.clickHint}>
          Click para acceder a opciones
        </ThemedText>
      </Pressable>
      {showButtons && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonList}>
            <Button title="Ver" onPress={() => alert("Editar")} />
            <Button title="Compartir ruta" onPress={() => alert("Compartir")} />
            <Button title="Editar" onPress={handleEdit} />
            <Button
              title="Cerrar"
              onPress={() => setShowButtons(false)}
              color={"red"}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default BusinessCardList;

// const styles = StyleSheet.create({});

const styles = StyleSheet.create({
  cardContainer: {
    position: "relative", // Asegura que el botón flotante se posicione relativo a este contenedor
    overflow: "hidden", // Para que el botón flotante no se vea fuera del contenedor
  },
  // businessCard: {
  //   padding: 16,
  //   borderRadius: 12,
  //   gap: 8,
  //   elevation: 2, // Sombra en Android
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  // },
  disabledCard: {
    opacity: 0.6,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  clickHint: {
    fontSize: 10,
    opacity: 0.5,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
  },
  buttonList: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 3, // Para sombra en Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: "column",
    gap: 5,
  },
  businessCard: {
    // backgroundColor:
    //   colorScheme === "light"
    //     ? Colors.light.background
    //     : Colors.dark.background,
    padding: 16,
    borderRadius: 12,
    gap: 8,
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

  flex: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: 10,
    // color: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
  },
  value: {
    flex: 1,
    overflow: "hidden",
    marginLeft: "auto",
    textAlign: "right",

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
