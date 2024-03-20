import { Dispatch, SetStateAction } from "react";
import { BoundingBoxResult } from "../types/BoundingBoxResult";

import { create } from "zustand";

type BoundingBoxState = {
  boundingBox: BoundingBoxResult | null;
  setBoundingBox: Dispatch<SetStateAction<BoundingBoxResult | null>>;
};

const useBoundingBoxState = create<BoundingBoxState>((set) => ({
  boundingBox: null,
  setBoundingBox: (boundingBox) =>
    set((state) => ({
      boundingBox:
        typeof boundingBox === "function"
          ? boundingBox(state.boundingBox)
          : boundingBox,
    })),
}));

export default useBoundingBoxState;
