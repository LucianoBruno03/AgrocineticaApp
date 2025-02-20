import { View, Text } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";

type Props = {};

// TODO: Revisar el rooteo y los stacks para que me slga el bton de back en new busisnes o edit cuando venga desde business y cuando swipees no se abra el drawer

const _layout = (props: Props) => {
  const { currentFormData } = useLocalSearchParams<{
    currentFormData: string;
  }>();

  const parsedForm = currentFormData ? JSON.parse(currentFormData) : {};

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
        name="details/[idBusiness]"
        options={{ gestureEnabled: false, title: "Detalles del negocio" }}
      />

      <Stack.Screen
        name="details/viewById/[idBusinessDetail]"
        options={{ gestureEnabled: false, title: "Detalles del negocio" }}
      />

      <Stack.Screen
        name="edit/[idBusiness]"
        options={{ gestureEnabled: false, title: "Editar negocio" }}
      />

      <Stack.Screen
        name="Items"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="BusinessCustomer"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="Customer"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="Gathering"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="Scales"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="Shipper"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="UnitTypes"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Selección",
        }}
      />

      <Stack.Screen
        name="LoadingPoints"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Selección",
        }}
      />

      <Stack.Screen
        name="UnloadingPoints"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Selección",
        }}
      />
    </Stack>
  );
};

export default _layout;
