import { Image, View } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "../ui/IconSymbol";
import { Switch } from "react-native-gesture-handler";
import { Appearance } from "react-native";
import { useState } from "react";
import { useAuthStore } from "@/zustand/authStore";

export default function CustomDrawer(props: any) {
  const router = useRouter();
  const { user, decodedClaims } = useAuthStore();

  const [isDarkMode, setIsDarkMode] = useState(
    Appearance.getColorScheme() === "dark"
  );

  const toggleTheme = (value: boolean) => {
    setIsDarkMode(value);
    Appearance.setColorScheme(value ? "dark" : "light");
  };

  return (
    <View style={{ flex: 1, flexDirection: "column", flexGrow: 1 }}>
      <DrawerContentScrollView {...props}>
        <View>
          <Image
            source={{
              uri: process.env.EXPO_PUBLIC_WEB_URL! + decodedClaims?.image_url,
            }}
            style={{
              width: 160,
              height: 160,
              borderRadius: 160,
              marginInline: "auto",
            }}
          />
          <ThemedText
            style={{
              fontSize: 16,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {decodedClaims?.fullName}
          </ThemedText>
        </View>
        <DrawerItem
          label={({ focused }) => {
            return (
              <ThemedText
                style={{
                  fontSize: 12,
                }}
              >
                Negocios
              </ThemedText>
            );
          }}
          onPress={() => {
            router.push("/business");
          }}
          icon={({ focused, color, size }) => {
            return <IconSymbol size={28} name="house.fill" color={color} />;
          }}
        />

        <DrawerItem
          label={({ focused }) => {
            return (
              <ThemedText
                style={{
                  fontSize: 12,
                }}
              >
                Ordenes de carga
              </ThemedText>
            );
          }}
          onPress={() => {
            router.push("/business");
          }}
          icon={({ focused, color, size }) => {
            return <IconSymbol size={28} name="house.fill" color={color} />;
          }}
        />

        {/* <DrawerItem
          label={({ focused }) => {
            return (
              <ThemedText
                style={{
                  fontSize: 12,
                }}
              >
                Explore
              </ThemedText>
            );
          }}
          onPress={() => {
            router.push("/explore");
          }}
          icon={({ focused, color, size }) => {
            return (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            );
          }}
        /> */}

        <DrawerItem
          label={({ focused }) => {
            return (
              <ThemedText
                style={{
                  fontSize: 12,
                }}
              >
                Cerrar sesión
              </ThemedText>
            );
          }}
          onPress={() => {
            router.push("/login");
          }}
          icon={({ focused, color, size }) => {
            return (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            );
          }}
        />
      </DrawerContentScrollView>

      <View style={{ padding: 20, flexDirection: "row", alignItems: "center" }}>
        <ThemedText style={{ marginRight: 8, fontSize: 16 }}>
          {isDarkMode ? "Modo oscuro" : "Modo claro"}
        </ThemedText>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>
    </View>
  );
}
