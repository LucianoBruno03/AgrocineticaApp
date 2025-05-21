import CustomDrawerToggleButton from "@/components/customs/CustomDrawerToggleButton";
import { Stack } from "expo-router";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

// TODO: Revisar el rooteo y los stacks para que me slga el bton de back en new busisnes o edit cuando venga desde business y cuando swipees no se abra el drawer

const Layout = (props: Props) => {
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
          title: "Negocios",
          headerLeft: () => <CustomDrawerToggleButton />, // Botón de Drawer
        }}
      />

      <Stack.Screen
        name="new-business"
        options={{ gestureEnabled: false, title: "Crear negocio" }}
      />

      <Stack.Screen
        name="(detail)/[idBusiness]/index"
        options={{ gestureEnabled: false, title: "Detalles del negocio" }}
      />

      <Stack.Screen
        name="(detail)/[idBusiness]/[idBusinessDetail]/index"
        options={{
          gestureEnabled: false,
          title: "Detalle del cupo",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <Stack.Screen
        name="(detail)/[idBusiness]/[idBusinessDetail]/Assign"
        options={{
          gestureEnabled: false,
          title: "Asignar cupo",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <Stack.Screen
        name="edit/[idBusiness]"
        options={{
          gestureEnabled: false,
          title: "Editar negocio",
          headerBackButtonDisplayMode: "minimal",
          // headerLeft: () => <CustomBackButton />,
        }}
      />
    </Stack>
  );
};

export default Layout;
