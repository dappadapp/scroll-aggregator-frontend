/* eslint-disable import/no-default-export */
"use client";

import Footer from "@/components/Footer";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import Navbar from "@/components/Navbar";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";

const LiFiWidgetNext = dynamic(
  () => import("../../components/BridgeWidget").then((module) => module.Widget) as any,
  {
    ssr: false,
    loading: () => <LoadingIndicator />,
  }
);

export default function Bridge({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="w-full h-full flex items-center">
      <LiFiWidgetNext />
    </div>
  );
}
