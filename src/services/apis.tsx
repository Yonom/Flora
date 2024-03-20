import { ClassificationResult } from "../types/ClassificationResult";
import jsonAutocomplete from "json-autocomplete";
import EventSource from "react-native-sse";
import Constants from "expo-constants";
import getDevServer from "react-native/Libraries/Core/Devtools/getDevServer";
import { jsonrepair } from "jsonrepair/lib/cjs";

const productionBaseUrl = Constants.expoConfig?.extra?.router?.origin ?? "";

function getBaseUrl() {
  if (process.env.NODE_ENV !== "production") {
    return getDevServer().url?.replace(/\/$/, "");
  }

  // Ensure no trailing slash
  return productionBaseUrl?.replace(/\/$/, "");
}

export const identifyApi = async (
  imageBase64: string,
  onUpdate: (partial: Partial<ClassificationResult>) => void
) => {
  return new Promise<ClassificationResult>((resolve, reject) => {
    const es = new EventSource(getBaseUrl() + "/api/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageBase64,
      }),
      pollingInterval: 0,
    });

    let msg = "";
    es.addEventListener("message", (event) => {
      if (!event.data) return;
      if (event.data === "[DONE]") {
        es.close();
      } else {
        const data = JSON.parse(event.data);
        const choice = data.choices[0];
        const delta = choice.delta.content ?? "";
        if (!delta) return;

        msg += delta;

        try {
          const json = JSON.parse(jsonAutocomplete(jsonrepair(msg)));
          onUpdate(json);

          if (choice.finish_reason) {
            resolve(json);
          }
        } catch {
          // ignore
        }
      }
    });

    es.addEventListener("error", (event) => {
      console.log("error");
      if (event.type === "error") {
        console.error("Connection error:", event.message);
      } else if (event.type === "exception") {
        console.error("Error:", event.message, event.error);
      }
      reject(event);
    });

    es.addEventListener("close", () => {
      try {
        resolve(JSON.parse(jsonrepair(msg)));
      } catch (e) {
        reject(e);
      }
    });

    es.open();
  });
};
