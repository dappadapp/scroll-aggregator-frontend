"use client";
import SlippageButton from "@/modules/SwapCard/SlippageButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function CardNavbar() {
  const path = usePathname();

  return (
    <div
      className={
        "hidden lg:flex w-full max-w-[600px] z-[10] px-8 justify-between items-center  "
      }
    >
      <div className="flex justify-start items-baseline lg:text-4xl text-xs gap-5 text-[#FFF0DD] ">
        <Link
          href={"/"}
          className={`transition-all ${
            path !== "/"
              ? "text-[#FFF0DD]/[0.24]"
              : "text-[#FFF0DD] border-[#FF7C5C] border-b-2 leading-6"
          }`}
        >
          Swap
        </Link>
        <Link
          href={"/bridge"}
          className={`transition-all ${
            path !== "/bridge"
              ? "text-[#FFF0DD]/[0.24]"
              : "text-[#FFF0DD] border-[#FF7C5C] border-b "
          }`}
        >
          Bridge
        </Link>
      </div>
      {/* <Link
        href="#"
        className={`transition-all ${path !== "/docs" ? "text-white/40" : ""}`}
      >
        Docs
      </Link>
      <Link
        className={`transition-all ${path !== "/stats" ? "text-white/40" : ""}`}
        href={"#"}
      >
        Stats
      </Link> */}
      {path === "/" && (
        <div className="flex justify-end z-1">
          <SlippageButton />
        </div>
      )}
    </div>
  );
}

export default CardNavbar;
