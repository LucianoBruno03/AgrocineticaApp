import CustomDrawer from "@/components/customs/CustomDrawer";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  console.log("colorScheme", colorScheme);
  //   // Check if user is authenticated
  //   useEffect(() => {
  //     const checkAuthStatus = async () => {
  //       const isAuthenticated = await checkAuth();
  //       if (!isAuthenticated) {
  //         router.replace('/(authStack)/login');
  //       }
  //     };

  //     checkAuthStatus();
  //   }, []);

  // If no user is available yet, don't render the drawer
  //   if (!user) {
  //     return (
  //       <View style={styles.loadingContainer}>
  //         <Text style={styles.loadingText}>Loading...</Text>
  //       </View>
  //     );
  //   }

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

// headerStyle: {
//   // backgroundColor: colorScheme ? "#282828" : "#FFFFFF",
// },
// headerTintColor: colorScheme ? "#FFFFFF" : "#27272A",
// headerTitleStyle: {
//   fontWeight: "600",
// },
// drawerActiveTintColor: "#3B82F6",
// drawerInactiveTintColor: colorScheme ? "#CBD5E1" : "#64748B",
// drawerStyle: {
//   // backgroundColor: colorScheme ? "#27272A" : "#FFFFFF",
//   width: 280,
// },
// drawerLabelStyle: {
//   marginLeft: -16,
// },
//   sceneContainerStyle: {
//     backgroundColor: colorScheme ? "#1E293B" : "#F1F5F9",
//   },
