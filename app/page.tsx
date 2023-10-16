"use client";
import React from "react";
import dynamic from "next/dynamic";

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
