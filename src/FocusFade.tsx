import React, { FC, PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const FocusFade: FC<PropsWithChildren<{}>> = ({ children }) => {
  const isFocused = useIsFocused();
  const containerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(isFocused ? 1 : 0);

    return {
      ...StyleSheet.absoluteFillObject,
      opacity,
    };
  });

  return <Animated.View style={containerStyle}>{children}</Animated.View>;
};

export default FocusFade;
