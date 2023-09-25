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
    <div className="w-full h-full flex items-center">
      <LiFiWidgetNext />
    </div>
  );
};

export default Bridge;
