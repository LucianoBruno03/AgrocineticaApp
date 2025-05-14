import { fetchEditBusiness } from "@/api/request/business/EditBusiness";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { ThemedText } from "../ThemedText";
import { fetchAddBusinessDetail } from "@/api/request/business/AddBusinessDetail";

type Props = {};

const AddAvailablePlaces = (props: Props) => {
  const { idBusiness, idBusinessDetail } = useLocalSearchParams<{
    idBusiness: string;
    idBusinessDetail: string;
  }>();

  const handleSubmit = async () => {
    addPlacesMutation.mutateAsync({ queryKey: ["business", idBusiness] });
  };

  const addPlacesMutation = useMutation({
    mutationFn: fetchAddBusinessDetail,
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Cupo agregado correctamente",
      });
      router.replace(`/business/${idBusiness}`);
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
    <View style={{ width: "100%", gap: 20 }}>
      <ThemedText>¿Estás seguro de que deseas agregar otro cupo?</ThemedText>

      <Pressable
        style={[
          styles.submitButton,
          addPlacesMutation.isPending && { opacity: 0.7 },
        ]}
        onPress={handleSubmit}
        disabled={addPlacesMutation.isPending}
      >
        <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
          Confirmar
        </ThemedText>
      </Pressable>
    </View>
  );
};

export default AddAvailablePlaces;

const styles = StyleSheet.create({
  submitButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0093D1",
    padding: 12,
    borderRadius: 12,
  },
});
