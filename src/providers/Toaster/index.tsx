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
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--paper-raised)",
            color: "var(--ink)",
            border: "1px solid var(--line-strong)",
            borderRadius: "4px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "var(--brand-ink)",
              secondary: "var(--paper)",
            },
          },
        }}
      />
    </>
  );
};

export default ToasterProvider;
