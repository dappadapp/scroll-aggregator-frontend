"use client";
import RefreshButton from "@/modules/SwapCard/RefreshButton";
import SlippageButton from "@/modules/SwapCard/SlippageButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function CardNavbar() {
  const path = usePathname();
  if (path === "/")
    return (
      <div
        className={
          "flex xl:w-[520px] lg:w-[480px] md:w-[400px] sm:w-[360px] w-full xs:max-w-full max-w-[320px] lg:px-12 xs:px-10 px-10 py-2 xs:my-2 my-0 justify-between items-center  "
        }
      >
        <div className="flex justify-start items-baseline lg:text-xl sm:text-base xs:text-sm text-xs gap-5 text-[#FFF0DD] ">
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
            href={"/"}
            className={`transition-all tooltip ${
              true
                ? "text-[#FFF0DD]/[0.24]"
                : "text-[#FFF0DD] cursor-not-allowed border-[#FF7C5C] border-b "
            }`}
          >
            Limit Order
            <span className={"tooltiptext text-sm"}>Soon</span>
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
          <>
            <div className="flex justify-end items-center xs:gap-2 gap-1">
              <RefreshButton />
              <SlippageButton />
            </div>
          </>
        )}
      </div>
    );
}

export default CardNavbar;
