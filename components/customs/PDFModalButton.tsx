import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

interface PDFModalButtonProps {
  document?: string; // Puede ser base64 o URL
}

const PDFModalButton: React.FC<PDFModalButtonProps> = ({ document }) => {
  const handleViewPDF = async () => {
    try {
      if (!document) return;

      let uri = "";

      const isBase64 = !document.startsWith("http");

      if (isBase64) {
        uri = `data:application/pdf;base64,${document}`;
      } else {
        // Descargamos el PDF primero
        const fileUri = FileSystem.documentDirectory + "temp.pdf";
        const downloadRes = await FileSystem.downloadAsync(document, fileUri);
        uri = downloadRes.uri;
      }

      await Print.printAsync({ uri });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al abrir el PDF",
        text2: "No se pudo abrir el PDF. Por favor, intenta nuevamente.",
        position: "bottom",
      });
    }
  };

  return (
    <Pressable
      style={[styles.actionButton, styles.button]}
      onPress={handleViewPDF}
    >
      <Ionicons name="eye-outline" size={20} color="white" />
      <ThemedText style={styles.actionButtonText}>Ver</ThemedText>
    </Pressable>
  );
};

export default PDFModalButton;

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
  },
  actionButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#0093D1",
  },
});
