import { AxiosInterceptor } from "@/api/axios/axios.interceptors";
import GlobalSafeAreaView from "@/components/customs/GlobalSafeAreaView/GlobalSafeAreaView.android";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

AxiosInterceptor();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GlobalSafeAreaView>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="(authStack)"
                options={{ animation: "fade" }}
              />
              <Stack.Screen
                name="(app)/(drawer)"
                options={{ animation: "fade" }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            {/* <StatusBar style="auto" /> */}
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Toast />
          </ThemeProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </GlobalSafeAreaView>
  );
}
