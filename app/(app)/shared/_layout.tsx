import { View, Text, Pressable } from "react-native";
import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { IconSymbol } from "@/components/ui/IconSymbol";
import CustomBackButton from "@/components/ui/CustomBackButton";

type Props = {};

// TODO: Revisar el rooteo y los stacks para que me slga el bton de back en new busisnes o edit cuando venga desde business y cuando swipees no se abra el drawer

const _layout = (props: Props) => {
  const { currentFormData } = useLocalSearchParams<{
    currentFormData: string;
  }>();

  const parsedForm = currentFormData ? JSON.parse(currentFormData) : {};

  const goBack = () => {
    router.back();
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => <CustomBackButton />,
      }}
    >
      <Stack.Screen
        name="Items"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="TransportCustomer"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="TransportEntity"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="Chauffeur"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="MainUnits"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="SecondaryUnits"
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
        name="Supplier"
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
        name="LoadingOrders"
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
