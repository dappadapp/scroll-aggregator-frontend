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
    <div className="w-full relative h-full flex items-center">
      <Image
        src="/app-bg.svg"
        alt="app-bg"
        width={200}
        height={200}
        className="hidden md:block lg:absolute w-full h-[900px] left-0 -top-[25px]"
      />
      <SwapCard />
    </div>
  );
}
