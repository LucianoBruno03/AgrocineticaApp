import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native"; // Asegurate de tener esta ruta bien
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CustomModal } from "./CustomModal";

interface ConfirmActionProps {
  onConfirm: () => void;
  message?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  children: React.ReactNode;
}

export const CustomConfirmAction: React.FC<ConfirmActionProps> = ({
  onConfirm,
  message = "¿Estás seguro de continuar con esta acción?",
  description,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = colorScheme === "light" ? Colors.light : Colors.dark;

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  return (
    <>
      <Pressable onPress={openModal}>{children}</Pressable>

      <CustomModal visible={visible} onClose={closeModal} title="Confirmación">
        <View>
          <Text style={[styles.message, { color: themeColors.text }]}>
            {message}
          </Text>
          {description ? (
            <Text style={[styles.description, { color: themeColors.text }]}>
              {description}
            </Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={closeModal}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "#e63946",
  },
  cancelText: {
    color: "#000",
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
