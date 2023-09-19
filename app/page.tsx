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
    <div className={"relative w-full h-screen overflow-x-hidden font-raleway"}>
      <div className={"absolute z-10 w-full flex h-full flex-col p-2"}>
        <div
          className={
            "container mx-auto md:px-20 gap-2 flex h-full justify-between md:justify-normal flex-col"
          }
        >
          <Navbar />

          <div className="w-full h-full flex items-center">
            <SwapCard />
          </div>
          {/* TODO: Graphic  */}
          <Footer />
        </div>
      </div>

      {/* BG */}
      <div className="w-full -z-10 md: min-h-[115vh] absolute top-0 overflow-hidden">
        <div
          className={`absolute h-[120vh] blur-[300px] overflow-hidden top-0 aspect-square bg-[radial-gradient(circle,#ffcd2c,#c99d32,#937132,#5d492d,#272625)] 
                left-0 translate-x-[-70%]
            rounded-full`}
        ></div>
        <div
          className={`absolute h-[120vh] blur-[300px]  overflow-hidden top-0 bg-[radial-gradient(circle,#ffcd2c,#c99d32,#937132,#5d492d,#272625)] aspect-square 
                 right-0 translate-x-[70%]
             rounded-full`}
        ></div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
