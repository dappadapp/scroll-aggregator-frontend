"use client";
import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import { WidgetEvents } from "./WidgetEvents";
import { useEffect, useMemo } from "react";
import useMobileDetect from "@/hooks/useMobileDetect";

export const Widget = () => {
  const { isMobile } = useMobileDetect();
  const widgetConfig: WidgetConfig = useMemo(
    () => ({
      integrator: "nextjs-example",
      containerStyle: {
        "--tw-shadow-colored": "0 1px 2px 0 var(--tw-shadow-color)",
        "--tw-shadow-color": "#FFE7DD",
        "--tw-shadow": "var(--tw-shadow-colored)",
        boxShadow:
          "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.10)",
        backgroundColor: "rgba(255, 255, 255, 0.01)",
        height: "auto",
        marginTop: "16px",
        marginBottom: "16px",
        width: isMobile() ? "300px" : "800px",
        minWidth: isMobile() ? "300px" : "375px",
        padding: "10px",
      },

      theme: {
        palette: {
          primary: { main: "rgba(255, 255, 255, 0.1)" },
          secondary: { main: "#F5B5FF" },
          background: {
            paper: "rgba(255, 255, 255, 0.01)",
            default: "rgba(255, 255, 255, 0.01)", // bg color container
          },
          color: "white",
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
          fontFamily: "'__League_Spartan_ed99a8', '__League_Spartan_Fallback_ed99a8'",
        },
      },
    }),
    []
  );

  useEffect(() => {
    console.log(isMobile());
    if (typeof window !== undefined) {
      let elementId = document.querySelector('[id^="widget-relative-container"]')?.id;
      let element = document.getElementById(elementId!);
      element?.classList.add("w-full");
      element?.classList.add("!max-w-[548px]");
    }
  }, [window, document]);

  return (
    <>
      <WidgetEvents />
      <LiFiWidget config={widgetConfig} integrator="nextjs-example" />
    </>
  );
};
