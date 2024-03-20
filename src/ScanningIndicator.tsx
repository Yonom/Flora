import React from "react";
import { Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import useBoundingBoxState from "./hooks/useBoundingBoxState";
import { useIsFocused } from "@react-navigation/core";

const ScanningIndicator = () => {
  const boundingBox = useBoundingBoxState((state) => state.boundingBox);

  const dimensions = Dimensions.get("window");
  const wrapperStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      borderWidth: 2,
      borderColor: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      top: withTiming(boundingBox?.top ?? dimensions.height / 2, {
        duration: 250,
      }),
      left: withTiming(boundingBox?.left ?? dimensions.width / 2, {
        duration: 250,
      }),
      width: withTiming(boundingBox?.width ?? 0, {
        duration: 250,
      }),
      height: withTiming(boundingBox?.height ?? 0, {
        duration: 250,
      }),
    };
  });

  const style = useAnimatedStyle(() => {
    const opacity = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 500 }),
        withTiming(0.25, { duration: 500 })
      ),
      -1
    );
    return {
      width: "100%",
      height: "100%",
      backgroundColor: "#fff",
      opacity,
    };
  }, []);

  const isFocused = useIsFocused();

  if (!boundingBox || !isFocused) return null;

  return (
    <Animated.View style={wrapperStyle}>
      <Animated.View style={style}></Animated.View>
    </Animated.View>
  );
};

export default ScanningIndicator;
