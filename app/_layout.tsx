import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosInterceptor } from "@/api/axios/axios.interceptors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

AxiosInterceptor();

const queryClient = new QueryClient();

// Esta función evita que la pantalla de inicio se oculte automáticamente osea que se muestre hasta que se cargue la fuente SpaceMono y se oculte la pantalla de inicio SplashScreen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Verificar el segmento actual y redirigir si es necesario
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    // Aquí puedes agregar tu lógica para verificar si el usuario está autenticado
    const isAuthenticated = true; // Reemplaza esto con tu lógica real de autenticación

    if (isAuthenticated && inAuthGroup) {
      // Si está autenticado y trata de acceder a rutas de auth, redirigir a home
      router.replace("/(tabs)/home");
    }
  }, [segments]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              headerBackVisible: false,
              headerTintColor: "#fff",
              gestureEnabled: false, // Deshabilita el gesto de retroceso
            }}
          >
            {/* Auth Group */}
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
                headerBackVisible: false,
                headerTransparent: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="register"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="logout"
              options={{
                gestureEnabled: false,
              }}
            />

            {/* Main App Group */}
            {/* <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          /> */}

            <Stack.Screen
              name="(drawer)"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />

            {/* Error Handling */}
            <Stack.Screen
              name="[...not-found]"
              options={{
                title: "Not Found",
              }}
            />
          </Stack>
          <StatusBar backgroundColor="transparent" style="auto" />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
