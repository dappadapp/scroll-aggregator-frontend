"use client";
import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import { WidgetEvents } from "./WidgetEvents";
import { useEffect, useMemo } from "react";

export const Widget = () => {
  const widgetConfig: WidgetConfig = useMemo(
    () => ({
      integrator: "nextjs-example",
      containerStyle: {
        "--tw-shadow-colored": "0 1px 2px 0 var(--tw-shadow-color)",
        "--tw-shadow-color": "#FAC790",
        "--tw-shadow": "var(--tw-shadow-colored)",
        boxShadow:
          "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.10)",
        backgroundColor: "rgba(255,255,255,0.05)",
        height: "auto",
        marginTop: "16px",
        marginBottom: "16px",
        width: "800px",
      },
      theme: {
        palette: {
          primary: { main: "rgba(0,0,0,0.10)" },
          secondary: { main: "#F5B5FF" },
          background: {
            paper: "rgba(0,0,0,0.05)", // bg color for cards
            default: "rgba(0,0,0,0.05)", // bg color container
          },
          grey: {
            300: "rgba(255,255,255,0.10)", // border light theme
            800: "rgba(255,255,255,0.10)", // border dark theme
          },
        },
        shape: {
          borderRadius: 0,
          borderColor: "white",
          borderRadiusSecondary: 0,
        },
        typography: {
          fontFamily: "'__Orbitron_888b92', '__Orbitron_Fallback_888b92'",
        },
      },
    }),
    []
  );

  useEffect(() => {
    let elementId = document.querySelector('[id^="widget-relative-container"]')?.id;
    let element = document.getElementById(elementId!);
    element?.classList.add("w-full");
    element?.classList.add("!max-w-[548px]");
  }, []);

  return (
    <>
      <WidgetEvents />
      <LiFiWidget config={widgetConfig} integrator="nextjs-example" />
    </>
  );
};
