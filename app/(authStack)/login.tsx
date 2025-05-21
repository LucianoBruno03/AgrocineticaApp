import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

import { login } from "@/api/request/login";
import { KeyboardLoginView } from "@/components/KeyboardAvoidingView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CustomTextField } from "@/components/customs/CustomTextField";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SecureStoreSetItemAsync } from "@/lib/SecureStorageHelpers";
import { LoginSchema } from "@/schemas/login";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";
  const accentColor = "#0093D1";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "daniela.centeno@agrocinetica.com",
      password: "dcenteno",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      try {
        // Uncomment these lines when you have the storage functionality ready
        await SecureStoreSetItemAsync("token", data.token);
        // await SecureStoreSetItemAsync("user", JSON.stringify(data.user));
        router.replace("/home");
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error al guardar los datos de autenticación",
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

  const onSubmit = async (data = { email: "", password: "" }) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      // Error handling is managed in mutation callbacks
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Hubo un error inesperado",
      });
    }
  };

  return (
    <KeyboardLoginView>
      <ThemedView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/agrocinetica/wave.png")}
              style={{ width: "100%", height: 200, resizeMode: "cover" }}
            />
          </View>

          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <ThemedText type="title" style={styles.firstTitle}>
                Bienvenido
              </ThemedText>
              <ThemedText style={styles.subTitle}>
                Ingrese sus credenciales para comenzar.
              </ThemedText>
            </View>

            <View style={styles.formContainer}>
              <Controller
                control={control}
                name="email"
                rules={{ required: true }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <CustomTextField
                    label="Email"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={error}
                    type="email"
                    placeholder="Email"
                    inputProps={{
                      style: [styles.textInput, { color: color }],
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                rules={{ required: true }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <CustomTextField
                    label="Contraseña"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={error}
                    type="password"
                    placeholder="Contraseña"
                    // secureTextEntry={!showPassword}
                    inputProps={{
                      style: [styles.textInput, { color: color }],
                    }}
                  />
                )}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.buttonLogin,
                isSubmitting && { opacity: 0.7 },
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <ThemedText type="default" style={styles.buttonText}>
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </ThemedText>
            </Pressable>

            <View style={styles.registerContainer}>
              <ThemedText type="default" style={styles.subTitle}>
                ¿No tienes una cuenta?
              </ThemedText>
              <Pressable
                onPress={() => {
                  router.push("/register");
                }}
              >
                <ThemedText type="default" style={styles.linkText}>
                  Regístrate
                </ThemedText>
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                // Handle forgot password
              }}
              style={({ pressed }) => [
                styles.forgotPasswordContainer,
                pressed && { opacity: 0.7 },
              ]}
            >
              <ThemedText type="default" style={styles.linkText}>
                ¿Olvidaste tu contraseña?
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardLoginView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingTop: 30,
    paddingHorizontal: 24,
    width: "100%",
    marginHorizontal: "auto",
  },
  imageContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
  firstTitle: {
    fontSize: 52,
    fontWeight: "bold",
    lineHeight: 52,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  textInput: {
    padding: 12,
    paddingStart: 20,
    height: 54,
    borderRadius: 30,
    backgroundColor: "#0093D110",
    fontSize: 16,
  },
  formContainer: {
    width: "100%",
    gap: 16,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: 8,
  },
  buttonLogin: {
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 30,
    backgroundColor: "#0093D1",
    shadowColor: "#0093D1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#0093D1",
    fontWeight: "600",
    fontSize: 16,
  },
  forgotPasswordContainer: {
    marginTop: 8,
    padding: 8,
  },
});
