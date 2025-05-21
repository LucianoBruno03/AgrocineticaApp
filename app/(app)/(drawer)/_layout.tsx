import { getUserInfo } from "@/api/request/auth/permissions";
import CustomDrawer from "@/components/customs/CustomDrawer";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/zustand/authStore";
import { useQuery } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const { accessToken } = useAuthStore();

  const validateSessionQuery = useQuery({
    queryKey: ["validateSession", accessToken],
    queryFn: getUserInfo,
    staleTime: 1000 * 60,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (validateSessionQuery.isPending) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require("../../../assets/images/agrocinetica/simpleLogo.png")}
          // style={{ height: 66 }}
          style={{ height: 120 }}
          resizeMode="contain"
        />
        <ActivityIndicator
          size={"large"}
          // style={styles.loading}
          color={"#0093D1"}
        />
      </View>
    );
  }

  // Check if user is authenticated
  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     const isAuthenticated = await checkAuth();
  //     if (!isAuthenticated) {
  //       router.replace("/(authStack)/login");
  //     }
  //   };

  //   checkAuthStatus();
  // }, []);

  // // If no user is available yet, don't render the drawer
  if (!accessToken) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require("../../../assets/images/agrocinetica/simpleLogo.png")}
          // style={{ height: 66 }}
          style={{ height: 120 }}
          resizeMode="contain"
        />
        <ActivityIndicator
          size={"large"}
          // style={styles.loading}
          color={"#0093D1"}
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Drawer
        defaultStatus="closed"
        drawerContent={CustomDrawer}
        screenOptions={{
          headerShown: false, // El Drawer no tiene header propio, se maneja por stacks hijos
          // drawerStyle: {
          //   width: 280,
          // },
        }}
      >
        {/* Solo incluís aquí las pantallas que deben tener Drawer */}
        <Drawer.Screen name="home" />
        <Drawer.Screen name="settings" />
        {/* Podés agregar otras como "perfil", "dashboard", etc. pero NO "business" */}
      </Drawer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  loadingText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#000",
  },
  // loading: {
  //   color: "#0093D1",
  //   width: 240,
  //   height: 240,
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
  // },
});
