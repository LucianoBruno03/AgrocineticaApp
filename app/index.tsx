import { Redirect } from "expo-router";
import React from "react";

const result = false; // Variable dice si redirigir

export default function HomeScreen() {
  return result ? (
    <Redirect href="/(app)/(drawer)/home" />
  ) : (
    <Redirect href="/(authStack)/login" />
  );
}
