import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function CardNavbar() {
  const path = usePathname();

  return (
    <div
      className={
        "hidden lg:flex gap-4 lg:text-base text-xs items-baseline text-[#382c2c] bg-white bg-opacity-5 shadow-sm shadow-[#FAC790] rounded-2xl p-3"
      }
    >
      <Link
        href={"/"}
        className={`transition-all ${
          path !== "/"
            ? " bg-[#dda15e]/[.20] text-black/50 "
            : " px-6 py-2 rounded-lg bg-[#dda15e] text-black "
        }`}
      >
        Swap
      </Link>
      <Link href={"/bridge"} className={`${path !== "/bridge" ? "text-black/30" : ""}`}>
        Bridge
      </Link>
      <Link href="/docs" className={`${path !== "/docs" ? "text-black/30" : ""}`}>
        Docs
      </Link>
      <Link className={`${path !== "/stats" ? "text-black/30" : ""}`} href={"/stats"}>
        Stats
      </Link>
    </div>
  );
}

export default CardNavbar;
