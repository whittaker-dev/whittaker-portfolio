"use client";
import { SplitFactoryProvider } from "@splitsoftware/splitio-react";
import React from "react";

import { SplitNames } from "@/packages/constants";

type Props = {
  children: React.ReactNode;
};

const sdkKey = process.env.NEXT_PUBLIC_SPLIT_IO_SDK_API_KEY;

/**
 * Without an SDK key the client cannot fetch flag definitions, so every treatment
 * evaluates to "control" and each gated section falls back to its "coming soon" state.
 * Split's localhost mode serves the mocked map below instead, which keeps the app fully
 * usable in local dev and on forks while production still reads the real flags.
 * @see https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#localhost-mode
 */
const MOCKED_TREATMENTS: SplitIO.MockedFeaturesMap = {
  [SplitNames.PROJECTS_SECTION]: "on",
  [SplitNames.CONTACT_SECTION]: "on",
};

const FeatureFlag = ({ children }: Props) => {
  const CONFIG: SplitIO.IBrowserSettings = sdkKey
    ? {
        core: {
          authorizationKey: sdkKey,
          key: process.env.NEXT_PUBLIC_SPLIT_IO_USER_KEY || "",
        },
      }
    : {
        core: {
          authorizationKey: "localhost",
          key: process.env.NEXT_PUBLIC_SPLIT_IO_USER_KEY || "anonymous",
        },
        features: MOCKED_TREATMENTS,
      };

  return (
    <SplitFactoryProvider config={CONFIG}>{children}</SplitFactoryProvider>
  );
};

export default FeatureFlag;
