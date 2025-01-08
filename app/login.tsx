import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View
} from "react-native";

import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { LoginSchema } from "@/schemas/login";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { CustomTextField } from "@/components/CustomTextField";
import { IconSymbol } from "@/components/ui/IconSymbol";




export default function Login() {
  const colorScheme = useColorScheme() ?? "light";
  const [showPassword, setShowPassword] = useState(false);


  const form = useForm<z.infer<typeof LoginSchema>>({
    defaultValues: {
      email: "",
      dni: "",
    },
    // resolver: zodResolver(loginSchema),
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const submitForm = () => {
    // loginMutation.mutate(form.getValues());


    console.log(form.getValues());
  };

// const loginMutation = useMutation({
//     mutationFn: loginUser,
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
    <KeyboardView>
      <ThemedView style={{flex: 1,}}>

      
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/wave.png")}
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
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={error}
                      type="email"
                      placeholder="Email"
                      
                    />
                  )}
                  name="email"
                />

        <TextInput
          placeholder="Contraseña"
          keyboardType="default"
          secureTextEntry={true}
          style={styles.textInput}
          placeholderTextColor="gray"
        />
        <Pressable style={styles.buttonLogin} onPress={() => {}}>
          <ThemedText type="default">Iniciar sesión</ThemedText>
        </Pressable>
        <ThemedText type="default" style={styles.subTitle}>
          ¿No tienes una cuenta? Regístrate
        </ThemedText>
        <ThemedText type="default" style={styles.subTitle}>
          ¿Olvidaste tu contraseña?
        </ThemedText>
      </View>
      </ThemedView>
    </KeyboardView>
    // {/* </ThemedView> */}
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "none",
    gap: 8,
    paddingTop: 40,
  },
  imageContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "none",
  },
  headerContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "80%",
    backgroundColor: "none",
  },
  firstTitle: {
    fontSize: 80,
    fontWeight: "bold",
    // color: "#343434",
    lineHeight: 80,
  },
  subTitle: {
    fontSize: 20,
    // color: "gray",
  },
  textInput: {
    padding: 10,
    paddingStart: 20,
    // color: "black",
    width: "80%",
    height: 50,
    borderRadius: 30,
    backgroundColor: "#0093D130",
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
