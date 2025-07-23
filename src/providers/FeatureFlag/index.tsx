"use client";
import { SplitFactoryProvider } from "@splitsoftware/splitio-react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const FeatureFlag = ({ children }: Props) => {
  const CONFIG: SplitIO.IBrowserSettings = {
    core: {
      authorizationKey: process.env.NEXT_PUBLIC_SPLIT_IO_SDK_API_KEY || "",
      key: process.env.NEXT_PUBLIC_SPLIT_IO_USER_KEY || "",
    },
  };

  return (
    <SplitFactoryProvider config={CONFIG}>{children}</SplitFactoryProvider>
  );
};

export default FeatureFlag;
