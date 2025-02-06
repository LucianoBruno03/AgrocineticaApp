import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { fetchAfipQuery } from "@/api/request/arca/SearchCuit";
import { CustomTextField } from "@/components/CustomTextField";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CountriesDropdown from "@/components/ui/dropdown/CountriesDropdown";
import LocalitiesDropdown from "@/components/ui/dropdown/LocalitiesDropdown";
import ProvincesDropdown from "@/components/ui/dropdown/ProvincesDropdown";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { RegisterSchema } from "@/schemas/register";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { CustomTextFieldMaps } from "@/components/CustomTextFieldMaps";
import { router } from "expo-router";

export default function Register() {
  const colorScheme = useColorScheme() ?? "light";
  const [showPassword, setShowPassword] = useState(false);
  const color = colorScheme === "light" ? "#000" : "#fff";

  const searchAfip = () => {
    const cuit = form.getValues("cuit");

    if (!cuit || cuit.length !== 11) {
      Toast.show({
        type: "error",
        text1: "CUIT inválido",
        text2: "El CUIT debe tener 11 caracteres",
      });
      return;
    }

    mutationAfip.mutate({ cuit });
  };

  const mutationAfip = useMutation({
    mutationFn: fetchAfipQuery,
    onSuccess: (data) => {
      form.setValue("businessName", data.fullName);
      form.setValue("categoryTypeId", data.taxpayerTypeId);
      form.setValue(
        "countryId",
        data.countryId != "00000000-0000-0000-0000-000000000000"
          ? data.countryId
          : ""
      );
      form.setValue(
        "provinceId",
        data.provinceId != "00000000-0000-0000-0000-000000000000"
          ? data.provinceId
          : ""
      );
      form.setValue(
        "locationId",
        data.locationId != "00000000-0000-0000-0000-000000000000"
          ? data.locationId
          : ""
      );
      form.setValue("address", data.address || "");
    },
    onError: (error: Error | AxiosError) => {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Usuario o contraseña incorrecto",
          });

          return;
        } else if (error.response.status === 403) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.response.data.message,
          });

          return;
        }
      }

      Toast.show({
        type: "error",
        text1: "Hubo un error inesperado",
      });
    },
  });

  const form = useForm<z.infer<typeof RegisterSchema>>({
    defaultValues: {
      isUser: true,
      roleName: "Transporte",
      cuit: "",
      businessName: "",
      tradeName: "",
      categoryTypeId: "string",
      countryId: "",
      provinceId: "",
      locationId: "",
      address: "",
      phone: "",
      email: "",
      //   isTransportUser: true,
      //   transportUserId: "string",
      //   isBusinessUser: true,
      //   businessUserId: "string",
      //   literDiscount: 0,
      //   isCurrentAccount: true,
      //   currentAccountAmount: 0,
      //   collectionDueDate: 0,
      //   paymentDueDate: 0,
      //   isTraditional: true,
      //   isSettlement: true,
      //   isPhysical: true,
      //   isDigital: true,
      //   interest: 0,
      eRoleId: "9e892ff0-c696-4633-b4fb-08dcdd6c735c",
      //   observation: "string",
      //   isSalesperson: true,
      //   url: "string",
      //   active: true,
      //   entitiesCollectionPaymentMethods: [
      //     {
      //       entityId: "string",
      //       collectionPaymentMethodId: "string",
      //     },
      //   ],
    },
    // resolver: zodResolver(registerSchema),
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const submitForm = () => {
    // registerMutation.mutate(form.getValues());

    console.log(form.getValues());
  };

  // const registerMutation = useMutation({
  //     mutationFn: registerUser,
  //     onSuccess: async (data) => {
  //       setAccessToken(data.token);
  //       await SecureStoreSetItemAsync("token", data.token);
  //       router.replace("/home");
  //     },
  //     onError: (error: Error | AxiosError) => {
  //       if (axios.isAxiosError(error)) {
  //         if (error.response.status === 401) {
  //           Toast.show({
  //             type: "error",
  //             text1: 'Error',
  //             text2: "Usuario o contraseña incorrecto",
  //           });

  //           return;
  //         } else if (error.response.status === 403) {
  //           Toast.show({
  //             type: "error",
  //             text1: 'Error',
  //             text2:error.response.data.message,

  //           });

  //           return;
  //         }
  //       }

  //       Toast.show({
  //         type: "error",
  //         text1: "Hubo un error inesperado",
  //       });
  //     },
  //   });
  const { register, handleSubmit, control } = form;

  return (
    // <ThemedView
    //   style={[
    //     styles.mainContainer,
    //     // ,
    //     // { backgroundColor: colorScheme === "light" ? "white" : "black" },
    //   ]}
    // >
    // <GestureHandlerRootView style={{ flex: 1 }}>
    <KeyboardView>
      <ThemedView style={{ flex: 1, paddingTop: 40 }}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/agrocinetica/wave.png")}
            style={{ width: "100%", height: 200 }}
          />
        </View>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <ThemedText type="title" style={styles.firstTitle}>
                Crear cuenta
              </ThemedText>
              <ThemedText style={styles.subTitle}>
                Por favor complete los siguientes campos
              </ThemedText>
            </View>

            <View style={styles.containerInput}>
              <View style={styles.cuitSearcher}>
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
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={error}
                      type="text"
                      placeholder="CUIT"
                      inputProps={{
                        style: [styles.textInput, { color: color }],
                      }}
                    />
                  )}
                  name="cuit"
                />
                <Pressable style={styles.cuitSearchButton} onPress={searchAfip}>
                  <IconSymbol
                    size={28}
                    name="magnifyingglass"
                    color={"white"}
                  />
                </Pressable>
              </View>

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({
                  field: { onChange, onBlur, value }, // value es importante para que el input se actualice
                  fieldState: { error },
                }) => (
                  <CustomTextField
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value} // Asegúrese de pasar la propuesta de valor
                    error={error}
                    type="text"
                    placeholder="Razón social"
                    inputProps={{
                      style: [styles.textInput, { color: color }],
                    }}
                  />
                )}
                name="businessName"
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
                  <CustomTextField
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={error}
                    type="text"
                    placeholder="Fantasía"
                    inputProps={{
                      style: [styles.textInput, { color: color }],
                    }}
                  />
                )}
                name="tradeName"
              />

              <CountriesDropdown form={form} />

              <ProvincesDropdown form={form} />

              <LocalitiesDropdown form={form} />

              <CustomTextFieldMaps />

              {/* <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    // <CustomTextFieldMaps
                    // placeholder="Dirección"
                    // apiKey="AIzaSyCq-1D7Y3zr4t6j1V9JL4R2JQc9X8JY1L4"
                    // onPlaceSelected={() => {}}
                    // startAdornment={
                    //   <IconSymbol size={24} name="location" color={color} />
                    // }
                    // error = {error}
                    // />
                  )}
                  name="address"
                /> */}
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
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={error}
                    type="text"
                    placeholder="Email"
                    inputProps={{
                      style: [styles.textInput, { color: color }],
                    }}
                  />
                )}
                name="email"
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
                  <CustomTextField
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={error}
                    type="text"
                    placeholder="Teléfono"
                    inputProps={{
                      style: [styles.textInput, { color: color }],
                    }}
                  />
                )}
                name="phone"
              />
            </View>
            <Pressable style={styles.buttonRegister} onPress={() => {}}>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Registrarse
              </Text>
            </Pressable>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <ThemedText type="default" style={styles.subTitle}>
                ¿Ya tienes una cuenta?
              </ThemedText>
              <Pressable
                onPress={() => {
                  router.push("/login");
                }}
              >
                <ThemedText
                  type="default"
                  style={(styles.subTitle, { color: "#0093D1" })}
                >
                  Inicia sesión
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardView>
    // {/* </ThemedView> */}
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    maxHeight: "100%",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingBlock: 40,
    paddingInline: 20,
    width: "100%",
    marginInline: "auto",
  },
  imageContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    top: 0,
    opacity: 0.3,
    zIndex: -1,
  },
  headerContainer: {
    alignItems: "flex-start",
    justifyContent: "center",

    width: "100%",
  },
  firstTitle: {
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: 40,
  },
  subTitle: {
    fontSize: 16,
  },
  textInput: {
    padding: 10,
    paddingStart: 20,
    height: 48,
    borderRadius: 30,
    backgroundColor: "#0093D120",
  },
  containerInput: {
    width: "100%",
    gap: 8,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  buttonRegister: {
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 30,
    backgroundColor: "#0093D1",
    fontWeight: "bold",
  },
  cuitSearcher: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cuitSearchButton: {
    position: "absolute",
    right: 4,
    top: "50%",
    transform: [{ translateY: "-50%" }],
    backgroundColor: "#0093D1",
    borderRadius: "50%",
    padding: 8,
  },
});
