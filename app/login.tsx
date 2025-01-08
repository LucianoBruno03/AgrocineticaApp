import { Link, Stack } from "expo-router";
import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ScrollView } from "react-native-gesture-handler";

export default function Login() {
  const colorScheme = useColorScheme() ?? "light";
  return (
    // <ThemedView
    //   style={[
    //     styles.mainContainer,
    //     // ,
    //     // { backgroundColor: colorScheme === "light" ? "white" : "black" },
    //   ]}
    // >
    <KeyboardView>
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

        <TextInput
          placeholder="Correo electrónico"
          keyboardType="email-address"
          style={styles.textInput}
          placeholderTextColor="gray"
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
