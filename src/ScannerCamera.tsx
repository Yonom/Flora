import React, { useRef } from "react";
import { Alert, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from "react-native-vision-camera";
import takePhotoAndDetectObjects from "./services/takePhotoAndDetectObjects";
import { useFocusEffect } from "expo-router";
import useBoundingBoxState from "./hooks/useBoundingBoxState";

const ScannerCamera = () => {
  const device = useCameraDevice("back");
  const format = useCameraFormat(device, [
    { photoResolution: { width: 512, height: 512 } },
  ]);

  const ref = useRef<Camera>(null);
  const setBoundingBox = useBoundingBoxState((state) => state.setBoundingBox);

  const hasScheduleRef = useRef(false);
  useFocusEffect(() => {
    let abortController = new AbortController();
    setBoundingBox(null);
    const scheduleLoop = () => {
      if (hasScheduleRef.current) return;
      hasScheduleRef.current = true;
      setTimeout(async () => {
        hasScheduleRef.current = false;
        if (abortController.signal.aborted) return;
        try {
          await takePhotoAndDetectObjects(ref.current!, setBoundingBox);

          scheduleLoop();
        } catch (ex) {
          Alert.alert("Error", (ex as Error).message);
        }
      }, 10);
    };
    scheduleLoop();
    return () => {
      abortController.abort();
    };
  });

  if (!device) return null;

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      format={format}
      isActive={true}
      ref={ref}
      photo={true}
      orientation="portrait"
    />
  );
};

export default ScannerCamera;
