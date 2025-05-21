"use client";

import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import type React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { AddIcon } from "../ui/icons/AddIcon";
import { CustomModal } from "./CustomModal";

interface FileData {
  uri: string;
  name: string;
  type: string;
  extension: string;
  base64Data: string;
}

interface CustomDocumentSelectorProps {
  onFileSelected: (fileData: FileData) => Promise<void>;
  buttonText?: string;
  allowedTypes?: ("image" | "pdf")[];
  containerStyle?: object;
  buttonStyle?: object;
  showPreview?: boolean;
  mutation: {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
}

const CustomDocumentSelector: React.FC<CustomDocumentSelectorProps> = ({
  onFileSelected,
  buttonText = "Seleccionar Archivo",
  allowedTypes = ["image", "pdf"],
  containerStyle,
  buttonStyle,
  showPreview = true,
  mutation = {
    isPending: false,
    isSuccess: false,
    isError: false,
  },
}) => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const selectFile = async () => {
    try {
      // Request permissions
      const { status: mediaLibraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (mediaLibraryStatus !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se necesita acceso a la galería para seleccionar archivos."
        );
        return;
      }

      // Show action sheet with options
      setShowButtons(true);
      //   Alert.alert(
      //     "Seleccionar archivo",
      //     "¿Qué tipo de archivo desea seleccionar?",
      //     [
      //       {
      //         text: "Cancelar",
      //         style: "cancel",
      //       },
      //       {
      //         text: "Tomar Foto",
      //         onPress: takePhoto,
      //         isPreferred: allowedTypes.includes("image"),
      //       },
      //       {
      //         text: "Seleccionar Imagen",
      //         onPress: pickImage,
      //         isPreferred: allowedTypes.includes("image"),
      //       },
      //       {
      //         text: "Seleccionar PDF",
      //         onPress: pickPdf,
      //         isPreferred: allowedTypes.includes("pdf"),
      //       },
      //     ]
      //   );
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert("Error", "No se pudo acceder a los archivos del dispositivo");
    }
  };

  const processFile = async (uri: string, name: string, type: string) => {
    setShowButtons(false);

    try {
      setLoading(true);

      // Get file extension
      const extension =
        // name.split(".").pop() || (type.includes("pdf") ? "pdf" : "jpg");
        "." + (name.split(".").pop() || (type.includes("pdf") ? "pdf" : "jpg"));

      // Read file as base64
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const mimePrefix = `data:${type};base64,`;
      const base64WithPrefix = mimePrefix + base64Data;

      const fileInfo: FileData = {
        uri,
        name,
        type,
        extension,
        base64Data: base64WithPrefix, // ¡Este es el completo!
      };

      setFileData(fileInfo);
    } catch (error) {
      console.error("Error processing file:", error);
      Alert.alert("Error", "No se pudo procesar el archivo");
    } finally {
      setLoading(false);
      setShowButtons(false);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se necesita acceso a la cámara para tomar fotos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.uri.split("/").pop() || "photo.jpg";
        await processFile(asset.uri, fileName, "image/jpeg");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.uri.split("/").pop() || "image.jpg";
        await processFile(asset.uri, fileName, asset.mimeType || "image/jpeg");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        const asset = result.assets[0];
        await processFile(asset.uri, asset.name, "application/pdf");
      }
    } catch (error) {
      console.error("Error picking PDF:", error);
      Alert.alert("Error", "No se pudo seleccionar el PDF");
    }
  };

  const removeFile = () => {
    setFileData(null);
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      // Notify parent when file is selected
      setShowButtons(false);
      setLoading(false);
      removeFile();
    }
  }, [mutation]);

  return (
    <>
      {showButtons && (
        <CustomModal
          title="Opciones"
          visible={showButtons}
          onClose={() => setShowButtons(false)}
          withHeader={false}
        >
          <View style={styles.buttonList}>
            <Pressable
              onPress={takePhoto}
              disabled={!allowedTypes.includes("image")}
              style={styles.buttons}
            >
              <ThemedText style={{ fontWeight: "medium", color: "#007AFF" }}>
                Tomar foto
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={pickImage}
              disabled={!allowedTypes.includes("image")}
              style={styles.buttons}
            >
              <ThemedText style={{ fontWeight: "medium", color: "#007AFF" }}>
                Seleccionar imagen
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={pickPdf}
              disabled={!allowedTypes.includes("pdf")}
              style={styles.buttons}
            >
              <ThemedText style={{ fontWeight: "medium", color: "#007AFF" }}>
                Seleccionar PDF
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setShowButtons(false)}
              style={[styles.buttons]}
            >
              <ThemedText style={{ fontWeight: "medium", color: "red" }}>
                Cancelar
              </ThemedText>
            </Pressable>
          </View>
        </CustomModal>
      )}
      <View style={[styles.container, containerStyle]}>
        {!fileData || !showPreview ? (
          <Pressable
            style={[
              styles.button,
              buttonStyle,
              loading && styles.disabledButton,
            ]}
            onPress={selectFile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                {/* <Ionicons name="add" size={24} color="white" /> */}
                <ThemedText style={styles.buttonText}>
                  <AddIcon
                    width={32}
                    height={32}
                    color="white"
                    // style={styles.buttonText}
                  />
                </ThemedText>
                {buttonText && (
                  <ThemedText style={styles.buttonText}>
                    {buttonText}
                  </ThemedText>
                )}
              </>
            )}
          </Pressable>
        ) : (
          <View style={styles.fileContainer}>
            {fileData.type.includes("image") ? (
              <Image source={{ uri: fileData.uri }} style={styles.image} />
            ) : (
              <View style={styles.pdfContainer}>
                <Ionicons name="document-outline" size={50} color="#FF5733" />
                <ThemedText
                  style={styles.fileName}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {fileData.name}
                </ThemedText>
              </View>
            )}

            <View style={styles.actionButtons}>
              <Pressable
                style={[styles.actionButton, styles.deleteButton]}
                onPress={removeFile}
                disabled={loading}
              >
                <Ionicons name="trash-outline" size={20} color="white" />
                <ThemedText style={styles.actionButtonText}>
                  Descartar
                </ThemedText>
              </Pressable>

              <Pressable
                style={[styles.actionButton, styles.selectButton]}
                onPress={selectFile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Ionicons name="refresh-outline" size={20} color="white" />
                    <ThemedText style={styles.actionButtonText}>
                      Cambiar
                    </ThemedText>
                  </>
                )}
              </Pressable>
            </View>
            {fileData && (
              <View style={styles.actionButtons2}>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.selectButton,
                    { backgroundColor: "#ABCA48" },
                  ]}
                  onPress={async () => {
                    setLoading(true);
                    try {
                      if (!fileData) return;
                      await onFileSelected(fileData);
                    } catch (err) {
                      Alert.alert("Error", "No se pudo subir el archivo");
                    } finally {
                      removeFile(); // Esto también limpia el fileData
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Ionicons
                        name="cloud-upload-outline"
                        size={20}
                        color="white"
                      />
                      <ThemedText style={styles.actionButtonText}>
                        Subir
                      </ThemedText>
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 40,
    lineHeight: 40,
    fontWeight: "bold",
    marginLeft: 8,
  },
  fileContainer: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#0093D150",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  pdfContainer: {
    height: 150,
    backgroundColor: "#0093D150",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  fileName: {
    marginTop: 10,
    fontSize: 14,
    maxWidth: "90%",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  actionButtons2: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 0,
    padding: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: "#e63946",
  },
  selectButton: {
    backgroundColor: "#0093D1",
  },
  actionButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
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
});

export default CustomDocumentSelector;
