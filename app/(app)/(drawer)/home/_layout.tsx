import CustomDrawerToggleButton from "@/components/customs/CustomDrawerToggleButton";
import { Stack } from "expo-router";
import React from "react";

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
          title: "",
          headerLeft: () => <CustomDrawerToggleButton />, // Botón de Drawer
        }}
      />
    </Stack>
  );
};

export default Layout;
