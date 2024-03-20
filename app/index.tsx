import React from "react";
import FocusFade from "../src/FocusFade";
import { StyleSheet, View } from "react-native";
import ScanningIndicator from "../src/ScanningIndicator";
import ScannerCamera from "../src/ScannerCamera";

export default function App() {
  return (
    <View
      style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "black" }}
    >
      <FocusFade>
        <ScannerCamera />
      </FocusFade>

      <ScanningIndicator />
    </View>
  );
}
