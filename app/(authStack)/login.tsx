import { Image, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CustomTextField } from "@/components/CustomTextField";
import { LoginSchema } from "@/schemas/login";
import { login } from "@/api/request/login";
import { SecureStoreSetItemAsync } from "@/lib/SecureStorageHelpers";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";

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
        console.error("Error saving auth data:", error);
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
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Hubo un error inesperado",
      });
    },
  });

  const onSubmit = async (data = { email: "", password: "" }) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      // Error handling is managed in mutation callbacks
      console.error("Login error:", error);
    }
  };

  return (
    <KeyboardView>
      <ThemedView style={{ flex: 1 }}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/agrocinetica/wave.png")}
            style={{ width: "100%", height: 200 }}
          />
        </View>

        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <ThemedText type="title" style={styles.firstTitle}>
              Hola
            </ThemedText>
            <ThemedText style={styles.subTitle}>
              Inicia sesión en tu cuenta
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
            style={[styles.buttonLogin, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <ThemedText type="default">
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </ThemedText>
          </Pressable>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <ThemedText type="default" style={styles.subTitle}>
              ¿No tienes una cuenta?
            </ThemedText>
            <Pressable
              onPress={() => {
                router.push("/register");
              }}
            >
              <ThemedText
                type="default"
                style={(styles.subTitle, { color: "#0093D1" })}
              >
                Regístrate
              </ThemedText>
            </Pressable>
          </View>

          <ThemedText type="default" style={styles.subTitle}>
            ¿Olvidaste tu contraseña?
          </ThemedText>
        </View>
      </ThemedView>
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingTop: 40,
    paddingInline: 20,
    width: "100%",
    marginInline: "auto",
  },
  imageContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "auto",
  },
  firstTitle: {
    fontSize: 80,
    fontWeight: "bold",
    lineHeight: 80,
  },
  subTitle: {
    fontSize: 20,
  },
  textInput: {
    padding: 10,
    paddingStart: 20,
    height: 48,
    borderRadius: 30,
    backgroundColor: "#0093D120",
  },
  formContainer: {
    width: "100%",
    gap: 12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonLogin: {
    width: "80%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 30,
    backgroundColor: "#0093D1",
  },
});
