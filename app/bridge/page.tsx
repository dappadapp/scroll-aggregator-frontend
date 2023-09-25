/* eslint-disable import/no-default-export */
"use client";

import Footer from "@/components/Footer";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import Navbar from "@/components/Navbar";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";

export const LiFiWidgetNext = dynamic(
  () => import("../../components/BridgeWidget").then((module) => module.Widget) as any,
  {
    ssr: false,
    loading: () => <LoadingIndicator />,
  }
);

const Bridge: NextPage = () => {
  return (
    <div className={"relative w-full h-screen overflow-x-hidden font-raleway"}>
      <div className={"absolute z-10 w-full flex h-full flex-col p-2"}>
        <div
          className={
            "container mx-auto md:px-20 gap-2 flex h-full justify-between md:justify-normal flex-col"
          }
        >
          <Navbar />

          <div className="w-full h-full flex items-center">
            <LiFiWidgetNext />
          </div>
          {/* TODO: Graphic  */}
          <Footer />
        </div>
      </div>

      {/* ANIMATION */}
      <div className={"absolute w-screen h-full z-[-1]"}>
        <div
          className={
            "flex relative items-center justify-between transition w-full h-full bg-animation"
          }
        >
          <div
            className={
              "absolute translate-x-[-20%] left-0 w-1/2 h-full flex flex-col justify-between items-center side"
            }
          >
            <span
              className={
                "absolute bg-[#FFA030]/50 top-0 left-1/2 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>

            <span
              className={
                "absolute bg-[#FFA030]/50 bottom-0 right-0 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>
          </div>
          <div
            className={
              "absolute translate-x-[30%] right-0 w-1/2 h-full flex flex-col justify-between items-center side"
            }
          >
            <span
              className={
                "absolute bg-[#FFA030]/50 top-[30%] left-0 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>

            <span
              className={
                "absolute bg-[#FFA030]/50 top-[60%] left-1/3 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default Bridge;
