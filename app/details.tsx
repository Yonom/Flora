import React from "react";
import { Image } from "expo-image";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import useBoundingBoxState from "../src/hooks/useBoundingBoxState";
import { useClassification } from "../src/hooks/useClassification";
import { ClassificationResult } from "../src/types/ClassificationResult";
import { kind } from "openai/_shims";

// const classificationFiles = [
//   require("../assets/mock/hotdog.png"),
//   require("../assets/mock/apple.png"),
//   require("../assets/mock/skyr.png"),
// ];

const bioticsRichnessTable = {
  1: 0,
  2: 10,
  3: 40,
  4: 60,
  5: 80,
};

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
        {/* <Text>{JSON.stringify(classification, null, 2)}</Text> */}
        {/* {!isDone && (
          <ActivityIndicator size="large" style={{ alignSelf: "center" }} />
        )} */}
        {/* {isDone && (
          <Image
            source={classificationFiles[0]}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
            contentPosition="top"
          />
        )} */}
        {classification && <Details classification={classification} />}
      </View>
    </ScrollView>
  );
};

const Details = ({
  classification,
}: {
  classification: Partial<ClassificationResult>;
}) => {
  const percentPreb = classification.rich_in_prebiotics
    ? bioticsRichnessTable[
        classification.rich_in_prebiotics as keyof typeof bioticsRichnessTable
      ]
    : null;
  const percentProb = classification.rich_in_probiotics
    ? bioticsRichnessTable[
        classification.rich_in_probiotics as keyof typeof bioticsRichnessTable
      ]
    : null;

  const percentCalorie = ((classification.calories ?? 0) / 2200) * 100;
  return (
    <View style={{}}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Microbiome Score</Text>
      <View
        style={{
          borderRadius: 100,
          overflow: "hidden",
          height: 20,
          flexDirection: "row",
          backgroundColor: "#eee",
          position: "relative",
          marginTop: 12,
        }}
      >
        <View
          style={{
            left: 0,
            position: "absolute",
            top: 0,
            bottom: 0,
            width: (Math.min(
              100,
              20 + ((percentPreb ?? 0) + (percentProb ?? 0)) / 2
            ) + "%") as any,
            backgroundColor: "#2AF085",
            borderRadius: 100,
          }}
        />
        <View
          style={{
            left: 0,
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "20%",
            backgroundColor: "lightgrey",
            borderRadius: 100,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginVertical: 16,
        }}
      >
        <View
          style={{
            flexGrow: 1,
            borderRadius: 16,
            padding: 16,
            backgroundColor: "#C7F0004D",
          }}
        >
          <Text style={{ fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Pre</Text>biotics
          </Text>
          <Text style={{ fontSize: 16 }}>
            <Text style={{ fontWeight: "bold", fontSize: 24 }}>
              {percentPreb} %
            </Text>{" "}
            daily need
          </Text>
        </View>
        <View
          style={{
            flexGrow: 1,
            borderRadius: 16,
            padding: 16,
            backgroundColor: "#6FE6F64D",
          }}
        >
          <Text style={{ fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Pro</Text>biotics
          </Text>
          <Text style={{ fontSize: 16 }}>
            <Text style={{ fontWeight: "bold", fontSize: 24 }}>
              {percentProb} %
            </Text>{" "}
            daily need
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Calorie Budget</Text>
      <View
        style={{
          borderRadius: 100,
          overflow: "hidden",
          height: 20,
          flexDirection: "row",
          backgroundColor: "#eee",
          position: "relative",
          marginTop: 12,
        }}
      >
        <View
          style={{
            right: 0,
            position: "absolute",
            top: 0,
            bottom: 0,
            width: (Math.min(100, 30 + percentCalorie) + "%") as any,
            backgroundColor: "#FF9001",
            borderRadius: 100,
          }}
        />
        <View
          style={{
            right: 0,
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "30%",
            backgroundColor: "lightgrey",
            borderRadius: 100,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginVertical: 16,
        }}
      >
        <View
          style={{
            flexGrow: 1,
            borderRadius: 16,
            padding: 16,
            backgroundColor: "#2AF0854D",
          }}
        >
          <Text style={{ fontSize: 16 }}>Protein</Text>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {classification.protein_grams}g
          </Text>
        </View>
        <View
          style={{
            flexGrow: 1,
            borderRadius: 16,
            padding: 16,
            backgroundColor: "#FF90014D",
          }}
        >
          <Text style={{ fontSize: 16 }}>Carbs</Text>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {classification.carbs_grams}g
          </Text>
        </View>
        <View
          style={{
            flexGrow: 1,
            borderRadius: 16,
            padding: 16,
            backgroundColor: "#FF42004D",
          }}
        >
          <Text style={{ fontSize: 16 }}>Fat</Text>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {classification.fat_grams}g
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#FF9001",
          padding: 20,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <Text style={styles.buttonText}>Eat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  progressContainer: {
    flexDirection: "row",
    height: 20,
  },
  progressBarPositive: {},
  progressBarNegative: {},
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  infoBox: {
    backgroundColor: "yellow",
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  nutrientContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  nutrientBox: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 10,
  },
  nutrientText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {},
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default DetailsScreen;
