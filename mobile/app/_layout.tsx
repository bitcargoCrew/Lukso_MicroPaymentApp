import React from "react";
import { AddressProvider } from "../components/AddressContext";
import { Slot } from "expo-router";

export default function App() {
  return (
    <AddressProvider>
      <Slot />
    </AddressProvider>
  );
}
