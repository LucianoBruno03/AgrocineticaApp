import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";

import { CustomModal } from "@/components/customs/CustomModal";
import { Colors, statusColors } from "@/constants/Colors";
import { Units } from "@/types/units/SearchUnits";
import { router } from "expo-router";

const UnitsCardList = ({
  item,
  isSelected,
  isSelectionMode,
  onLongPress,
}: {
  item: Units;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onLongPress?: () => void;
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const [showButtons, setShowButtons] = React.useState(false);

  const handleEdit = () => {
    setShowButtons(false);
    router.navigate(`/units/edit/${item.id}`);
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={[
          styles.businessCard,

          item.isAvailable !== true && styles.disabledCard,
          {
            backgroundColor:
              colorScheme === "light"
                ? Colors.light.background
                : Colors.dark.background,
          },
          isSelected && styles.cardSelected,
        ]}
        key={item.id}
        onPress={() => {
          if (isSelectionMode) {
            onLongPress && onLongPress();
            return;
          }
          setShowButtons(!showButtons);
        }}
        onLongPress={onLongPress}
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
            {item.domain}
          </ThemedText>
          <View
            style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderColor: "#79797950",
              borderWidth: 0.5,
              backgroundColor:
                item.isAvailable === true
                  ? statusColors.ACTIVO
                  : statusColors.CANCELADO,
            }}
          ></View>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Razón Social</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.entityBusinessName}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Tipo de Unidad</ThemedLabel>
          <ThemedText style={styles.value}>{item.typeUnitName}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Marca</ThemedLabel>
          <ThemedText style={styles.value}>{item.brandName}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Dominio</ThemedLabel>
          <ThemedText style={styles.value}>{item.domain}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Modelo</ThemedLabel>
          <ThemedText style={styles.value}>{item.modelName}</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedLabel>Escalable</ThemedLabel>
          <ThemedText style={styles.value}>{item.scalableName}</ThemedText>
        </View>

        {/* <View style={styles.infoContainer}>
          <ThemedLabel>Disponible</ThemedLabel>
          <ThemedText style={styles.value}>
            {item.isAvailable === true
              ? "Sí"
              : item.isAvailable === false
              ? "No"
              : item.isAvailable}
          </ThemedText>
        </View> */}

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

export default UnitsCardList;

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
  cardSelected: {
    borderColor: "#ABCA48",
    borderWidth: 2,
    backgroundColor: "#ABCA4850",
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
