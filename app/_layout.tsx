import { AxiosInterceptor } from "@/api/axios/axios.interceptors";
import GlobalSafeAreaView from "@/components/customs/GlobalSafeAreaView/GlobalSafeAreaView.android";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SecureStoreGetItemAsync } from "@/lib/SecureStorageHelpers";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { Appearance } from "react-native";

AxiosInterceptor();

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const onAppReady = useCallback(async () => {
    try {
      if (loaded) {
        const mode = (await SecureStoreGetItemAsync("colorMode")) as
          | "light"
          | "dark"
          | null;
        if (mode) {
          Appearance.setColorScheme(mode);
        }
      }
    } catch (error) {
      console.warn("Error loading colorMode:", error);
    } finally {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    onAppReady();
  }, [onAppReady]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GlobalSafeAreaView>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              headerBackVisible: false,
              headerTintColor: "#fff",
              gestureEnabled: false, // Deshabilita el gesto de retroceso
              headerBackButtonDisplayMode: "minimal",
            }}
          >
            {/* Auth Group */}
            <Stack.Screen
              name="(authStack)/login"
              options={{
                headerShown: false,
                headerBackVisible: false,
                headerTransparent: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="(authStack)/register"
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
              name="(app)/(drawer)"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />

            {/* Error Handling */}
            <Stack.Screen
              name="+not-found"
              options={{
                title: "Not Found",
              }}
            />
          </Stack>

          {/* <StatusBar
            barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
            backgroundColor={
              colorScheme === "dark" ? "#000" : "rgba(255, 255, 255, 0.8)"
            }
          /> */}
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalSafeAreaView>
  );
}
