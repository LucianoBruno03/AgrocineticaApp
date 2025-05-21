import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import GlobalSafeAreaView from "@/components/customs/GlobalSafeAreaView/GlobalSafeAreaView.android";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosInterceptor } from "@/api/axios/axios.interceptors";

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
              <Stack.Screen name="(app)" options={{ animation: "fade" }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            {/* <StatusBar style="auto" /> */}
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          </ThemeProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </GlobalSafeAreaView>
  );
}
