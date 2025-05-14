import { useColorScheme } from "@/hooks/useColorScheme";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";

import { CustomModal } from "@/components/customs/CustomModal";
import { Colors, statusColors } from "@/constants/Colors";
import { Business } from "@/types/business/SearchBusiness";
import dayjs from "dayjs";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const BusinessCardList = ({ item }: { item: Business }) => {
  const colorScheme = useColorScheme() ?? "light";
  const [showButtons, setShowButtons] = useState(false);

  const handleEdit = () => {
    setShowButtons(false);
    router.navigate(`/business/edit/${item.id}`);
  };

  const handleView = () => {
    setShowButtons(false);
    router.navigate(`/business/${item.id}`);
  };

  const handleShare = () => {
    setShowButtons(false);
    const url = `https://api.whatsapp.com/send?text=https%3A%2F%2Fwww.google.com%2Fmaps%2Fdir%2F%3Fapi%3D1%26origin%3D0.000000000000000%2C0.000000000000000%26destination%3D0.000000000000000%2C0.000000000000000%26waypoints%3D0.000000000000000%2C0.000000000000000%7C0.000000000000000%2C0.000000000000000%7C0.000000000000000%2C0.000000000000000%7C0.000000000000000%2C0.000000000000000%7C0.000000000000000%2C0.000000000000000%7C0.000000000000000%2C0.000000000000000%7C0.000000000000000%2C0.000000000000000%7C0.000000000000000%2C0.000000000000000`;
    Linking.openURL(url).catch((err) =>
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo abrir la URL",
      })
    );
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
              backgroundColor: statusColors[item.businessStatusName] || "gray",
            }}
          ></View>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Fecha de carga</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.loadDate
              ? dayjs(item.loadDate).format("DD/MM/YYYY")
              : "Sin fecha"}
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
        <CustomModal
          title="Opciones"
          visible={showButtons}
          onClose={() => setShowButtons(false)}
          withHeader={false}
        >
          <View style={styles.buttonList}>
            <Pressable onPress={() => handleView()} style={styles.buttons}>
              <ThemedText style={{ fontWeight: "medium", color: "#007AFF" }}>
                Ver
              </ThemedText>
            </Pressable>
            <Pressable onPress={handleShare} style={styles.buttons}>
              <ThemedText style={{ fontWeight: "medium", color: "#007AFF" }}>
                Compartir ruta
              </ThemedText>
            </Pressable>
            <Pressable onPress={handleEdit} style={styles.buttons}>
              <ThemedText style={{ fontWeight: "medium", color: "#007AFF" }}>
                Editar
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => setShowButtons(false)}
              style={[styles.buttons]}
            >
              <ThemedText style={{ fontWeight: "medium", color: "red" }}>
                Cerrar
              </ThemedText>
            </Pressable>
          </View>
        </CustomModal>
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
  buttons: {
    padding: 8,
    borderRadius: 12,
    color: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonList: {
    width: "100%",
    flexDirection: "column",
    gap: 5,
  },
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
