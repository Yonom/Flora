import { Dispatch, SetStateAction } from "react";
import { BoundingBoxResult } from "../types/BoundingBoxResult";
import { identifyApi } from "./apis";
import { cropBoundingBox } from "./boundingBoxUtils";
import { ClassificationResult } from "../types/ClassificationResult";

const classifyBoundingBox = async (
  boundingBox: BoundingBoxResult,
  set: Dispatch<SetStateAction<Partial<ClassificationResult> | undefined>>
) => {
  const image = await cropBoundingBox(boundingBox);
  const classification = await identifyApi(image.base64!, set);
  return classification;
};

export default classifyBoundingBox;
