/* eslint-disable import/no-default-export */
"use client";

import { LoadingIndicator } from "@/components/LoadingIndicator";
import dynamic from "next/dynamic";
import Image from "next/image";

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
    <div className="w-full relative h-full flex items-center z-[3]">
      <Image
        src="/app-bg.svg"
        alt="app-bg"
        width={200}
        height={200}
        className="hidden md:block lg:absolute w-full h-[900px] left-0 -top-[100px]"
      />
      <LiFiWidgetNext />
    </div>
  );
}
