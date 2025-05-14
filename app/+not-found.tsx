import { Link, Stack } from "expo-router";
import { StyleSheet, Image, View, SafeAreaView } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/agrocinetica/wave.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContainer}>
            <ThemedText type="title" style={styles.title}>
              ¡Oops!
            </ThemedText>

            <ThemedText type="title" style={styles.subtitle}>
              Página no encontrada
            </ThemedText>

            <ThemedText type="default" style={styles.description}>
              Lo sentimos, pero la página que estás buscando no existe, fue
              eliminada, cambió de nombre o no está disponible en este momento.
            </ThemedText>

            <Link href="/" style={styles.link}>
              <ThemedText type="link" style={styles.linkText}>
                Volver al inicio
              </ThemedText>
            </Link>
          </View>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    position: "absolute",
    top: -60,
    left: 0,
    right: 0,
  },
  image: {
    width: "100%",
    height: 150,
  },
  textContainer: {
    gap: 12,
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "600",
    textTransform: "uppercase",
    color: "#ABCA48",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    backgroundColor: "#0093D1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  linkText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
