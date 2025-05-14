import { fetchSearchCategoriesTypes } from "@/api/request/categoriesTypes/SearchCategoriesTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { z } from "zod";
import CustomDropdown from "../customs/CustomDropdown";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { fetchChangeStateBusinessDetail } from "@/api/request/business/ChangeStateBusinessDetail";
import { ThemedText } from "../ThemedText";
import { ChangeStateSchema } from "@/schemas/newBusiness";

// Constante para la clave de consulta
const ESTADOS_DEL_NEGOCIO = "ESTADOS DEL NEGOCIO";
const ESTADOS_PERMITIDOS = ["CANCELADO", "ACTIVO", "CUBIERTO POR EL CLIENTE"];

interface ChangeStateProps {
  businessId: string;
  id: string;
  onStateChange?: (statusId: string, statusName: string) => void;
  businessDetailStatusId?: string;
  businessDetailStatusName?: string;
}

const ChangeState = ({
  businessId,
  id,
  businessDetailStatusId = "",
  businessDetailStatusName = "",
  onStateChange,
}: ChangeStateProps) => {
  // Configuración del formulario con valores por defecto
  const form = useForm<z.infer<typeof ChangeStateSchema>>({
    defaultValues: {
      id,
      businessId,
      businessDetailStatusId,
      businessDetailStatusName,
    },
    resolver: zodResolver(ChangeStateSchema),
  });

  // Obtener errores del formulario
  const { errors } = form.formState;

  // Consulta única para obtener los estados del negocio
  const queryKey = [
    "getBusinessStates",
    ESTADOS_DEL_NEGOCIO,
    ESTADOS_PERMITIDOS,
  ];

  const { data: categoriesData } = useQuery({
    queryKey,
    queryFn: () =>
      fetchSearchCategoriesTypes({
        queryKey: [
          "getSearchCategoriesTypes",
          "",
          ESTADOS_DEL_NEGOCIO,
          ESTADOS_PERMITIDOS,
        ],
      }),
  });

  // Observar cambios en el estado seleccionado
  const selectedStatusId = form.watch("businessDetailStatusId");
  const selectedStatusName = form.watch("businessDetailStatusName");

  // Notificar cambios al componente padre
  useEffect(() => {
    if (selectedStatusId && selectedStatusName && onStateChange) {
      onStateChange(selectedStatusId, selectedStatusName);
    }
  }, [selectedStatusId, selectedStatusName, onStateChange]);

  // Mapeo para los items del dropdown
  const dataMapper = (item: any) => ({
    label: item.name,
    value: item.id,
    name: item.name,
  });

  // Mutación para actualizar el estado
  const updateStateMutation = useMutation({
    mutationFn: fetchChangeStateBusinessDetail,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Estado actualizado correctamente",
      });
      router.replace(`/business/${businessId}`);
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

  // Manejar envío del formulario
  const handleSubmit = async () => {
    try {
      await updateStateMutation.mutateAsync({
        data: form.getValues(),
        id,
      } as any);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Hubo un error inesperado",
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomDropdown
        form={form}
        label="Estado"
        fieldName="businessDetailStatusId"
        items={categoriesData?.data?.map(dataMapper)}
        dataMapper={dataMapper}
        disabled={false}
        searchEnabled={false}
        error={errors.businessDetailStatusId}
        onChange={(value) => {
          // Encontrar el objeto seleccionado y actualizar el nombre
          const selected = categoriesData?.data.find(
            (item) => item.id === value
          );
          if (selected) {
            form.setValue("businessDetailStatusName", selected.name);
          }
        }}
      />

      <Pressable
        style={[
          styles.submitButton,
          updateStateMutation.isPending && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={updateStateMutation.isPending}
      >
        <ThemedText style={styles.buttonText}>Confirmar</ThemedText>
      </Pressable>
    </View>
  );
};

export default ChangeState;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 20,
  },
  submitButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0093D1",
    padding: 12,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
