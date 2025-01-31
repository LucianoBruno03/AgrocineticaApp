import { Redirect } from "expo-router";
import React from "react";

const result = false; // Variable que determina si redirigir

export default function HomeScreen() {
  return result ? <Redirect href="/home" /> : <Redirect href="/login" />;
}
