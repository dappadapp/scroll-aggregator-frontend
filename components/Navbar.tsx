import React, { useState } from "react";
import ZetaGateLogo from "./Logo";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

type Props = {};
const ConnectButton: any = dynamic(() => import("./ConnectButton"), {
  ssr: false,
});

const Navbar: React.FC<Props> = (props) => {
  const path = usePathname();
  return (
    <div
      className={"w-full flex flex-row items-center justify-between mt-2 md:mt-10 gap-2"}
    >
      <div className="flex gap-6 items-center">
        <ZetaGateLogo />
        <div className="flex flex-row justify-center mt-5 mb-5">
          <div className={"flex gap-4 md:text-base text-xs text-[#AAA]"}>
            {/* <Link href={"/"} className={`${path === "/" ? "text-white" : ""}`}>
              App
            </Link>
            <a href="/">Docs</a>
            <Link className={`${path === "/stats" ? "text-white" : ""}`} href={"/stats"}>
              Stats
            </Link> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-3">
        <ConnectButton />
      </div>
    </div>
  );
};
export default Navbar;
