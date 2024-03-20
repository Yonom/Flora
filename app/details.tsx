import React from "react";
import { Image } from "expo-image";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import useBoundingBoxState from "../src/hooks/useBoundingBoxState";
import { useClassification } from "../src/hooks/useClassification";

// const classificationFiles = [
//   require("../assets/mock/hotdog.png"),
//   require("../assets/mock/apple.png"),
//   require("../assets/mock/skyr.png"),
// ];

const DetailsScreen = () => {
  const { photo } = useBoundingBoxState((state) => state.boundingBox) ?? {};
  const [classification, isDone] = useClassification();

  return (
    <ScrollView contentContainerStyle={{}}>
      <View>
        <Image
          style={{ width: "100%", height: 250 }}
          source={{ uri: photo?.path }}
        />
      </View>
      <View
        style={{
          marginTop: -20,
          borderRadius: 20,
          backgroundColor: "white",
          minHeight: "100%",
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {classification?.name ?? "Loading..."}
        </Text>
        <Text>{JSON.stringify(classification, null, 2)}</Text>
        {!isDone && (
          <ActivityIndicator size="large" style={{ alignSelf: "center" }} />
        )}
        {/* {isDone && (
          <Image
            source={classificationFiles[0]}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
            contentPosition="top"
          />
        )} */}
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;
