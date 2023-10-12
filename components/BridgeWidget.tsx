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
        "--tw-shadow-color": "#FAD5C3",
        "--tw-shadow": "var(--tw-shadow-colored)",
        boxShadow:
          "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.10)",
        backgroundColor: "#0D1520",
        height: "auto",
        marginTop: "16px",
        marginBottom: "16px",
        width: isMobile() ? "300px" : "800px",
        minWidth: isMobile() ? "300px" : "375px",
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
          fontFamily: "'__Montserrat_d1047c', '__Montserrat_Fallback_d1047c'",
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
