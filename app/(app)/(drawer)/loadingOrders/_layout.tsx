import CustomDrawerToggleButton from "@/components/customs/CustomDrawerToggleButton";
import { Stack } from "expo-router";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

// TODO: Revisar el rooteo y los stacks para que me slga el bton de back en new busisnes o edit cuando venga desde business y cuando swipees no se abra el drawer

const _layout = (props: Props) => {
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
          title: "Ordenes de carga",
          headerLeft: () => <CustomDrawerToggleButton />, // Botón de Drawer
        }}
      />

      <Stack.Screen
        name="edit/[idLoadingOrder]"
        options={{
          gestureEnabled: false,
          title: "Editar orden de carga",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <Stack.Screen
        name="changeStatus"
        options={{
          title: "Cambiar estado de orden de carga",
          headerLeft: () => <CustomDrawerToggleButton />, // Botón de Drawer
        }}
      />
    </Stack>
  );
};

export default _layout;
