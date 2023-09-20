import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function CardNavbar() {
  const path = usePathname();

  return (
    <div
      className={
        "hidden lg:flex gap-4 lg:text-base text-xs items-baseline text-[#382c2c] bg-white bg-opacity-5 shadow-md shadow-[#A57F32] rounded-2xl p-3"
      }
    >
      <Link
        href={"/"}
        className={`transition-all ${
          path !== "/"
            ? "text-white/40"
            : "text-[#A57F32] px-6 py-2 rounded-lg bg-white bg-opacity-10"
        }`}
      >
        Swap
      </Link>
      <Link href={"/bridge"} className={`${path !== "/bridge" ? "text-white/40" : ""}`}>
        Bridge
      </Link>
      <Link href="/docs" className={`${path !== "/docs" ? "text-white/40" : ""}`}>
        Docs
      </Link>
      <Link className={`${path !== "/stats" ? "text-white/40" : ""}`} href={"/stats"}>
        Stats
      </Link>
    </div>
  );
}

export default CardNavbar;
