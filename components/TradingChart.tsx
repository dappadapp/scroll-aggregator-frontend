//@ts-nocheck

import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise: any;

export default function TradingViewWidget() {
  const onLoadScriptRef = useRef<any>();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (document.getElementById("tradingview_75228") && "TradingView" in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "NASDAQ:AAPL",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_top_toolbar: true,
          hide_legend: true,
          container_id: "tradingview_75228",
        });
      }
    }
  }, []);

  return (
    <div className="tradingview-widget-container md:block hidden h-[300px]">
      <div id="tradingview_75228" className="h-[300px]" />
    </div>
  );
}
