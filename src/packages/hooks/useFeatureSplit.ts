import { useSplitTreatments } from "@splitsoftware/splitio-react";
import { SplitNames } from "../constants";

export function useFeatureSplit(splitName: SplitNames) {
  const {
    treatments: {
      [splitName]: { treatment, config },
    },
    isReady,
  } = useSplitTreatments({ names: [splitName] });

  console.log("treatment", treatment);

  return {
    isReady,
    config,
    treatment,
    isTreatmentActive: treatment === "on",
  };
}
