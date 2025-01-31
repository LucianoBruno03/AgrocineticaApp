import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";

type Props = {};

// TODO: Revisar el rooteo y los stacks para que me slga el bton de back en new busisnes o edit cuando venga desde business y cuando swipees no se abra el drawer

const _layout = (props: Props) => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Negocios",
          headerLeft: () => <DrawerToggleButton />, // Botón de Drawer
        }}
      />
      <Stack.Screen
        name="new-business"
        options={{ gestureEnabled: false, title: "Crear negocio" }}
      />
      <Stack.Screen
        name="edit-business"
        options={{ gestureEnabled: false, title: "Editar negocio" }}
      />
      <Stack.Screen
        name="ItemsSelected"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />
    </Stack>
  );
};

export default _layout;
