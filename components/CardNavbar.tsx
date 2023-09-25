"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function CardNavbar() {
  const path = usePathname();

  return (
    <div
      className={
        "hidden lg:flex gap-4 lg:text-base text-xs items-baseline text-[#382c2c] bg-white bg-opacity-5 shadow-sm shadow-[#FAC790] rounded-2xl p-3 mt-5"
      }
    >
      <Link
        href={"/"}
        className={`transition-all  ${
          path !== "/"
            ? "text-white/40"
            : "text-[#FAC790] rounded-lg bg-white bg-opacity-10 px-6 py-2"
        }`}
      >
        Swap
      </Link>
      <Link
        href={"https://faucet.aggre.io/"}
        target="_blank"
        className={`transition-all ${path !== "/faucet" ? "text-white/40" : ""}`}
      >
        Faucet
      </Link>
      <Link
        href={"/bridge"}
        className={`transition-all py-2 ${
          path !== "/bridge"
            ? "text-white/40"
            : "text-[#FAC790] rounded-lg bg-white bg-opacity-10 px-6 "
        }`}
      >
        Bridge
      </Link>
      <Link
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
      </Link>
    </div>
  );
}

export default CardNavbar;
