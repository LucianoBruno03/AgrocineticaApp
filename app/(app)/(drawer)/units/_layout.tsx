import CustomDrawerToggleButton from "@/components/customs/CustomDrawerToggleButton";
import { Stack } from "expo-router";
import React from "react";

// TODO: Revisar el rooteo y los stacks para que me slga el bton de back en new busisnes o edit cuando venga desde business y cuando swipees no se abra el drawer

const _layout = () => {
  // const { currentFormData } = useLocalSearchParams<{
  //   currentFormData: string;
  // }>();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Unidades",
          headerLeft: () => <CustomDrawerToggleButton />, // Botón de Drawer
        }}
      />

      <Stack.Screen
        name="new"
        options={{
          gestureEnabled: false,
          title: "Crear unidad",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <Stack.Screen
        name="edit/[idUnit]"
        options={{
          gestureEnabled: false,
          title: "Editar unidad",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
};

export default _layout;
