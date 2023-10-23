"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const SwapCard: any = dynamic(() => import("@/modules/SwapCard/SwapCard"), {
  ssr: false,
});

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="w-full relative lg:px-0 px-4 h-full bg-transparent lg:bg-none  flex items-center">
      <Image
        src="/app-bg.svg"
        alt="app-bg"
        width={200}
        height={200}
        className="absolute lg:w-full lg:h-[900px] left-0 right-0 h-full w-full object-cover lg:object-none lg:left-0 lg:-top-[25px]"
      />
      <SwapCard />
    </div>
  );
}
