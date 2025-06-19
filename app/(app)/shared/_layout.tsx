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
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="SelectUnitTypes"
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

      <Stack.Screen
        name="Brands"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="Models"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />

      <Stack.Screen
        name="Scalables"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          title: "Búsqueda",
        }}
      />
    </Stack>
  );
};

export default Layout;
