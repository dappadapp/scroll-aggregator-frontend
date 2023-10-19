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
        borderRadius: "48px",
        backgroundColor: "rgba(26,29,36,0.80)",
        "--tw-backdrop-blur": "blur(52px)",
        backdropFilter: "var(--tw-backdrop-blur)",
        height: "auto",
        marginTop: "16px",
        marginBottom: "16px",
        width: isMobile() ? "300px" : "800px",
        minWidth: isMobile() ? "300px" : "375px",
        padding: "10px",
      },
      languages: {
        default: "en",
        allow: ["en"],
      },
      appearance: "dark",
      hiddenUI: ["appearance"],
      theme: {
        palette: {
          primary: { main: "#FFF0DD" },
          secondary: { main: "#FFF0DD" },
          background: {
            paper: "rgba(26,29,36,0)",
            default: "rgba(26,29,36,0)", // bg color container
          },
          color: "#FFF0DD",
        },
        shape: {
          borderRadius: 0,
          borderColor: "#FFF0DD",
          borderRadiusSecondary: 0,
        },
        typography: {
          allVariants: { color: "#FFF0DD" },
        },
      },
    }),
    []
  );

  useEffect(() => {
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
