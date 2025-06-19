import { fetchNewBrands } from "@/api/request/brands/NewBrands";
import { CustomTextField } from "@/components/customs/CustomTextField";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { BrandSchema } from "@/schemas/Brand";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Switch, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const AddBrand = () => {
  const colorScheme = useColorScheme() ?? "light";

  const color = colorScheme === "light" ? "#000" : "#fff";

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof BrandSchema>>({
    defaultValues: {
      name: "",
      active: true,
    },
    resolver: zodResolver(BrandSchema),
  });

  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = form;

  const newBrandMutation = useMutation({
    mutationFn: fetchNewBrands,
    onSuccess: async (data) => {
      try {
        queryClient.refetchQueries({
          queryKey: ["getBrandsQuery"],
        });
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Marca creada exitosamente",
        });
        router.back();
      } catch {
        //   (error)
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error al guardar los datos de marca",
        });
      }
    },
    onError: (error: Error | AxiosError) => {
      if (isAxiosError(error)) {
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

  const onSubmit = (data: z.infer<typeof BrandSchema>) => {
    // los datos que sean "" o null, los eliminamos
    Object.keys(data).forEach((key) => {
      if ((data as any)[key] === "" || (data as any)[key] === null) {
        delete (data as any)[key];
      }
    });
    newBrandMutation.mutateAsync(data);
  };

  return (
    <KeyboardView>
      <View style={{ flex: 1 }}>
        <View style={styles.formContainer}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <CustomTextField
                value={value ? value : ""}
                onBlur={onBlur}
                onChangeText={onChange}
                error={error}
                placeholder="Nombre de la marca"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="name"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Switch
                  value={value}
                  onValueChange={onChange}
                  // onBlur={onBlur}
                  // thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: "#0093D1" }}
                />
                <ThemedText style={{ color: color }}>Mostrar marca</ThemedText>
              </View>
            )}
            name="active"
          />

          <Pressable
            style={[
              styles.SubmitButton,
              newBrandMutation.isPending && { opacity: 0.7 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={newBrandMutation.isPending}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
              Guardar
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </KeyboardView>
  );
};

export default AddBrand;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
    width: "100%",
    gap: 16,
  },
  textInput: {
    padding: 10,
    paddingStart: 20,
    height: 48,
    borderRadius: 10,
  },
  SubmitButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    backgroundColor: "#0093D1",
    padding: 12,
    borderRadius: 12,
    marginTop: "auto",
  },
});
