import CustomBackButton from "@/components/customs/CustomBackButton";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

// TODO: Revisar el rooteo y los stacks para que me slga el bton de back en new busisnes o edit cuando venga desde business y cuando swipees no se abra el drawer

const Layout = (props: Props) => {
  const { currentFormData } = useLocalSearchParams<{
    currentFormData: string;
  }>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const parsedForm = currentFormData ? JSON.parse(currentFormData) : {};

  // const goBack = () => {
  //   router.back();
  // };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
        headerLeft: () => (
          <>{Platform.OS === "ios" ? <CustomBackButton /> : <></>}</>
        ),
      }}
    >
      <Stack.Screen
        name="AddBrand"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Agregar marca",
        }}
      />

      <Stack.Screen
        name="AddModel"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Agregar modelo",
        }}
      />
    </Stack>
  );
};

export default Layout;
