"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
};

const ToasterProvider = ({ children }: Props) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default ToasterProvider;
