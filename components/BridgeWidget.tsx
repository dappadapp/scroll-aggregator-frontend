import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import { WidgetEvents } from "./WidgetEvents";
import { useMemo } from "react";

export const Widget = () => {
  const widgetConfig: WidgetConfig = useMemo(
    () => ({
      integrator: "nextjs-example",
      containerStyle: {
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.10)",
        backgroundColor: "rgba(255,255,255,0.05)",
        height: "auto",
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
      },
    }),
    []
  );
  return (
    <>
      <WidgetEvents />
      <LiFiWidget config={widgetConfig} integrator="nextjs-example" />
    </>
  );
};
