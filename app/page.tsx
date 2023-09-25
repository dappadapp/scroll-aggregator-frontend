"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const SwapCard: any = dynamic(() => import("@/modules/SwapCard/SwapCard"), {
  ssr: false,
});

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="w-full h-full flex items-center">
      <SwapCard />
    </div>
  );
}
