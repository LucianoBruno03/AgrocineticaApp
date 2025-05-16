import CustomDrawerToggleButton from "@/components/customs/CustomDrawerToggleButton";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

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
          title: "Ordenes de compra",
          headerLeft: () => <CustomDrawerToggleButton />, // Botón de Drawer
        }}
      />

      <Stack.Screen
        name="new"
        options={{
          gestureEnabled: false,
          title: "Crear orden de compra",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <Stack.Screen
        name="edit/[idPurchaseOrder]"
        options={{
          gestureEnabled: false,
          title: "Editar orden de carga",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
};

export default _layout;
