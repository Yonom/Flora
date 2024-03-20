import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { BoundingBoxResult } from "../types/BoundingBoxResult";
import { Dimensions } from "react-native";
import { ObjectDetectionResult } from "react-native-mlkit-odt";
import { PhotoFile } from "react-native-vision-camera";

export const cropBoundingBox = async ({
  photo,
  objectDetectionResult: detection,
}: BoundingBoxResult) => {
  const originY = Math.max(
    0,
    detection.bounding.originX - detection.bounding.width * 0.1
  );
  const originX = Math.max(
    0,
    photo.height -
      detection.bounding.height -
      detection.bounding.originY -
      detection.bounding.height * 0.1
  );
  const height = Math.min(
    photo.width - originX,
    detection.bounding.width * 1.2
  );
  const width = Math.min(
    photo.height - originY,
    detection.bounding.height * 1.2
  );

  const manipulationResult = await manipulateAsync(
    photo.path,
    [
      {
        crop: { originX, originY, width, height },
      },
    ],
    { base64: true, compress: 1, format: SaveFormat.JPEG }
  );
  return manipulationResult;
};

export const getBoundingBox = (
  photo: PhotoFile,
  objectDetectionResult: ObjectDetectionResult | undefined,
  lastBox: BoundingBoxResult | null
): BoundingBoxResult | null => {
  if (!objectDetectionResult) return null;
  const { bounding } = objectDetectionResult;

  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const { width: photoWidth, height: photoHeight } = photo;

  const normalized = {
    top: bounding.originX / photoWidth,
    leftEdgeFromRight: bounding.originY / photoHeight,
    height: bounding.width / photoWidth,
    width: bounding.height / photoHeight,
  };

  const sameId =
    !!lastBox &&
    lastBox?.objectDetectionResult.trackingID ===
      objectDetectionResult.trackingID;

  return {
    top: normalized.top * windowHeight,
    left:
      windowWidth -
      normalized.width * windowWidth -
      normalized.leftEdgeFromRight * windowWidth,
    height: normalized.height * windowHeight,
    width: normalized.width * windowWidth,
    photo,
    objectDetectionResult,
    sameIdRepetition: sameId ? lastBox?.sameIdRepetition + 1 : 0,
    sameIdSince: sameId ? lastBox.sameIdSince : new Date(),
  };
};
