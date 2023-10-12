"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function CardNavbar() {
  const path = usePathname();

  return (
    <div
      className={
        "hidden lg:flex gap-5 lg:text-base text-xs items-baseline text-[#382c2c] bg-white/[.01] bg-opacity-5 shadow-sm shadow-[#FFE7DD] rounded-2xl p-4 mt-5 mb-2"
      }
    >
      <Link
        href={"/"}
        className={`transition-all py-2 ${
          path !== "/"
            ? "text-white/40 text-lg"
            : "text-[#FFE7DD] rounded-lg bg-white bg-opacity-10 px-6 py-2 text-xl"
        }`}
      >
        Swap
      </Link>
      <Link
        href={"/faucet"}
        className={`transition-all py-2 ${
          path !== "/faucet"
            ? "text-white/40 text-lg"
            : "text-[#FFE7DD] rounded-lg bg-white bg-opacity-10 px-6 text-xl"
        }`}
      >
        Faucet
      </Link>
      <Link
        href={"/bridge"}
        className={`transition-all py-2 ${
          path !== "/bridge"
            ? "text-white/40 text-lg"
            : "text-[#FFE7DD] rounded-lg bg-white bg-opacity-10 px-6 text-xl"
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
