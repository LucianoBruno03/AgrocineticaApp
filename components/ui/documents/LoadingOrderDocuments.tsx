import { fetchAddLoadingOrderFile } from "@/api/request/loadingOrders/AddLoadingOrderFile";
import CustomDocumentSelector from "@/components/customs/CustomDocumentSelector";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import LoadingOrderFilesList from "../lists/LoadingOrderFilesList";

type Props = {
  idLoadingOrder: string;
  // onFileSelected: (fileData: FileData) => void;
  // buttonText?: string;
  // allowedTypes?: ("image" | "pdf")[];
  // containerStyle?: object;
  // buttonStyle?: object;
  // showPreview?: boolean;
};

const LoadingOrderDocuments = ({ idLoadingOrder }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: fetchAddLoadingOrderFile,
    onSuccess: async (data) => {
      try {
        // Toast.show({
        //   type: "success",
        //   text1: "Éxito",
        //   text2: "Archivo guardado correctamente",
        // });
        queryClient.refetchQueries({
          queryKey: ["getLoadingOrderFilesListQuery"],
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error al guardar los datos de negocio",
        });
      }
    },
    onError: (error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Usuario o contraseña incorrectos",
          });
          return;
        }

        if (error.response?.status === 403) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.response?.data.message || "Acceso denegado",
          });
          return;
        }

        if (error.response?.status === 400) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.response?.data.message || "Hubo un error inesperado",
          });
          return;
        }

        if (error.response?.status === 404) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: `${
              error.response?.data.exception || "Hubo un error inesperado"
            }`,
          });
          return;
        }

        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Hubo un error inesperado",
        });
      }
    },
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: 10,
      }}
    >
      <CustomDocumentSelector
        onFileSelected={async (fileData) => {
          if (!fileData) return;
          const formData = {
            loadingOrderFiles: [
              {
                loadingOrderId: idLoadingOrder,
                name: fileData.name,
                fileExtension: fileData.extension,
                file: {
                  name: fileData.name,
                  extension: fileData.extension,
                  data: fileData.base64Data,
                },
              },
            ],
          };
          await mutation.mutateAsync(formData);
        }}
        buttonText=""
        // buttonText="Seleccionar Archivo"
        // containerStyle={{ marginBottom: 20 }}
        buttonStyle={{ backgroundColor: "#ABCA48" }}
        showPreview={true}
        mutation={mutation}
      />

      <LoadingOrderFilesList idLoadingOrder={idLoadingOrder} />
    </View>
  );
};

export default LoadingOrderDocuments;
