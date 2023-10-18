"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function CardNavbar() {
  const path = usePathname();

  return (
    <div
      className={
        "hidden lg:flex w-full max-w-[540px] px-8 justify-start gap-5 lg:text-4xl z-10 text-xs items-baseline text-[#FFF0DD] "
      }
    >
      <Link
        href={"/"}
        className={`transition-all ${
          path !== "/"
            ? "text-[#FFF0DD]/[0.24]"
            : "text-[#FFF0DD] border-[#FF7C5C] border-b leading-6"
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
    </div>
  );
}

export default CardNavbar;
