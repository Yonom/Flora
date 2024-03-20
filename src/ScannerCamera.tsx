import React, { useRef } from "react";
import { StyleSheet } from "react-native";
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

  useFocusEffect(() => {
    let abortController = new AbortController();
    setBoundingBox(null);
    const scheduleLoop = () => {
      setTimeout(async () => {
        if (abortController.signal.aborted) return;
        await takePhotoAndDetectObjects(ref.current!, setBoundingBox);

        scheduleLoop();
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
