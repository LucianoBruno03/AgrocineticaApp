import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BlurView } from "expo-blur";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  animationType?: "none" | "slide" | "fade";
  withHeader?: boolean;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title = "Modal",
  children,
  animationType = "fade",
  withHeader = true,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = colorScheme === "light" ? Colors.light : Colors.dark;

  const handleClose = () => {
    Keyboard.dismiss(); // Cierra el teclado primero
    onClose(); // Luego ejecuta la función de cierre
  };

  return (
    <Modal
      animationType={animationType}
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <BlurView
          intensity={40}
          tint="dark"
          style={styles.overlay}
          experimentalBlurMethod="dimezisBlurView"
        >
          <View
            style={[
              styles.container,
              { backgroundColor: themeColors.background },
            ]}
          >
            {withHeader && (
              <View style={styles.header}>
                <Text style={[styles.title, { color: themeColors.text }]}>
                  {title}
                </Text>
                <Pressable
                  onPress={handleClose}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && styles.buttonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Cerrar modal"
                >
                  <Ionicons name="close" size={24} color={themeColors.text} />
                </Pressable>
              </View>
            )}

            <View style={styles.content}>{children}</View>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    width: "90%",
    maxWidth: 500,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(150, 150, 150, 0.1)",
  },
  buttonPressed: {
    opacity: 0.7,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  content: {
    width: "100%",
  },
});
