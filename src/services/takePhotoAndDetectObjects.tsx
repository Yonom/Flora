import { Dispatch, SetStateAction } from "react";
import MlkitOdt, { ObjectDetectorMode } from "react-native-mlkit-odt";
import { Camera, PhotoFile } from "react-native-vision-camera";
import { BoundingBoxResult } from "../types/BoundingBoxResult";
import { router } from "expo-router";
import { getBoundingBox } from "./boundingBoxUtils";

const detectFromPhoto = (photo: PhotoFile) => {
  return MlkitOdt.detectFromUri("file:///" + photo.path, {
    detectorMode: ObjectDetectorMode.STREAM,
    shouldEnableClassification: false,
    shouldEnableMultipleObjects: false,
  });
};

const takePhotoAndDetectObjects = async (
  camera: Camera,
  set: Dispatch<SetStateAction<BoundingBoxResult | null>>
) => {
  const photo = await camera.takePhoto({
    flash: "off",
    qualityPrioritization: "speed",
    enableShutterSound: false,
  });

  const result = await detectFromPhoto(photo);

  set((lastBox) => {
    const box = getBoundingBox(photo, result[0], lastBox);

    // navigate to details if the same object is detected 100 times in a row
    if (
      box &&
      box.sameIdRepetition > 10 &&
      new Date().getTime() - box.sameIdSince.getTime() > 2000
    ) {
      router.navigate({
        pathname: "/details",
      });
    }

    return box;
  });
};

export default takePhotoAndDetectObjects;
