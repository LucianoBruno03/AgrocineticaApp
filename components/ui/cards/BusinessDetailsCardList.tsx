import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";

import { CustomModal } from "@/components/customs/CustomModal";
import ChangeState from "@/components/pages/business/ChangeState";
import { Colors } from "@/constants/Colors";
import { BusinessDetails } from "@/types/business/SearchBusinessDetails";
import { router, useLocalSearchParams } from "expo-router";

const BusinessDetailsCardList = ({ item }: { item: BusinessDetails }) => {
  const colorScheme = useColorScheme() ?? "light";
  const [showButtons, setShowButtons] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);

  const { idBusiness, idBusinessDetail } = useLocalSearchParams<{
    idBusiness: string;
    idBusinessDetail: string;
  }>();

  const handleView = () => {
    setShowButtons(false);
    router.navigate(`/business/${item.businessId}/${item.id}`);
  };

  const handleEdit = () => {
    setShowButtons(false);
    setModalEdit(true);
  };

  const handleAssign = () => {
    setShowButtons(false);
    router.navigate(`/business/${item.businessId}/${item.id}/Assign`);
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={[
          styles.businessCard,
          item.businessDetailStatusName == "CANCELADO" && styles.disabledCard,
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
              backgroundColor:
                item.businessDetailStatusName == "CANCELADO"
                  ? "red"
                  : item.businessDetailStatusName == "ACTIVO"
                  ? "blue"
                  : item.businessDetailStatusName == "GENERADO"
                  ? "yellow"
                  : item.businessDetailStatusName == "ASIGNADO"
                  ? "orange"
                  : item.businessDetailStatusName == "CUBIERTO"
                  ? "green"
                  : item.businessDetailStatusName == "CUBIERTO PARCIAL"
                  ? "lightgreen"
                  : item.businessDetailStatusName == "CUBIERTO POR EL CLIENTE"
                  ? "darkgreen"
                  : "gray",
            }}
          ></View>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Usuario</ThemedLabel>
          <ThemedText style={styles.value}>{item.businessUserName}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Cliente</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.businessEntityBusinessName}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Producto</ThemedLabel>
          <ThemedText style={styles.value}>{item.businessItemName}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Estado</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.businessDetailStatusName}
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
            {item.businessDetailStatusName == "ACTIVO" && (
              <>
                <Pressable
                  onPress={() => handleAssign()}
                  style={styles.buttons}
                >
                  <ThemedText
                    style={{ fontWeight: "medium", color: "#007AFF" }}
                  >
                    Asignar
                  </ThemedText>
                </Pressable>
                <Pressable onPress={() => handleEdit()} style={styles.buttons}>
                  <ThemedText
                    style={{ fontWeight: "medium", color: "#007AFF" }}
                  >
                    Editar estado
                  </ThemedText>
                </Pressable>
              </>
            )}
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

      <CustomModal
        title="Cambiar estado del detalle"
        visible={modalEdit}
        onClose={() => setModalEdit(false)}
      >
        <ChangeState
          // getCategoriesTypesListQueryKey="yourQueryKeyHere"
          businessId={item.businessId}
          id={item.id}
          businessDetailStatusId={item.businessDetailStatusId}
          businessDetailStatusName={item.businessDetailStatusName}
          // onStateChange={(statusId, statusName) => {
          //   setModalEdit(false);
          //   // Actualizar el estado del item en la lista
          //   // Esto es solo un ejemplo, deberías hacerlo de acuerdo a tu lógica
          //   item.businessDetailStatusId = statusId;
          //   item.businessDetailStatusName = statusName;
          // }}
        />
      </CustomModal>
    </View>
  );
};

export default BusinessDetailsCardList;

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

  buttonList: {
    width: "100%",
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
