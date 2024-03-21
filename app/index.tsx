import React, { useEffect } from "react";
import FocusFade from "../src/FocusFade";
import { StyleSheet, View } from "react-native";
import ScanningIndicator from "../src/ScanningIndicator";
import ScannerCamera from "../src/ScannerCamera";
import { useCameraPermission } from "react-native-vision-camera";

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, []);

  return (
    <View
      style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "black" }}
    >
      {hasPermission && (
        <FocusFade>
          <ScannerCamera />
        </FocusFade>
      )}
      <ScanningIndicator />
    </View>
  );
}
