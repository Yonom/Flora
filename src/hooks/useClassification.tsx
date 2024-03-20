import { useEffect, useRef, useState } from "react";
import useBoundingBoxState from "./useBoundingBoxState";
import classifyBoundingBox from "../services/classifyBoundingBox";
import { ClassificationResult } from "../types/ClassificationResult";

export const useClassification = () => {
  const boundingBox = useBoundingBoxState((state) => state.boundingBox);
  const ref = useRef(false);
  const doneRef = useRef(false);
  const [classification, setClassification] =
    useState<Partial<ClassificationResult>>();
  useEffect(() => {
    if (!boundingBox) return;
    if (ref.current) return;
    ref.current = true;

    classifyBoundingBox(boundingBox, setClassification).then((c) => {
      doneRef.current = true;
      setClassification(c);
    });
  }, []);
  return [classification, doneRef.current] as const;
};
