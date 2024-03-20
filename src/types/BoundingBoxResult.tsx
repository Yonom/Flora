import { ObjectDetectionResult } from "react-native-mlkit-odt";
import { PhotoFile } from "react-native-vision-camera";

export type BoundingBoxResult = {
  top: number;
  left: number;
  width: number;
  height: number;
  objectDetectionResult: ObjectDetectionResult;
  photo: PhotoFile;
  sameIdRepetition: number;
  sameIdSince: Date;
};
