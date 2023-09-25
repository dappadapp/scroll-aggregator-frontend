"use client"
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
        className={`transition-all ${
          path !== "/"
            ? "text-white/40"
            : "text-[#FAC790] px-6 py-2 rounded-lg bg-white bg-opacity-10"
        }`}
      >
        Swap
      </Link>
      <Link href={"https://faucet.aggre.io/"} target="_blank" className={`${path !== "/bridge" ? "text-white/40" : ""}`}>
        Faucet
      </Link>
      <Link href={"#"} className={`${path !== "/bridge" ? "text-white/40" : ""}`}>
        Bridge
      </Link>
      <Link href="#" className={`${path !== "/docs" ? "text-white/40" : ""}`}>
        Docs
      </Link>
      <Link className={`${path !== "/stats" ? "text-white/40" : ""}`} href={"#"}>
        Stats
      </Link>
    </div>
  );
}

export default CardNavbar;
