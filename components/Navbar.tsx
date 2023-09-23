"use client";
import React, { Fragment, useState } from "react";
import ZetaGateLogo from "./Logo";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import NetworkSelector from "./NetworkSelector";
import { FaBars } from "react-icons/fa";

type Props = {};
const ConnectButton: any = dynamic(() => import("./ConnectButton"), {
  ssr: false,
});

const menuItems = [
  {
    title: "Swap",
    href: "/",
  },
  {
    title: "Bridge",
    href: "/bridge",
  },
  {
    title: "Stats",
    href: "/stats",
  },
  {
    title: "Docs",
    href: "/docs",
  },
];
const Navbar: React.FC<Props> = (props) => {
  const path = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const menu = menuItems.map((menuItem) => {
    return (
      <Link
        href={menuItem.href || ""}
        className={`flex items-center gap-2 transition-all hover:text-white ${
          path === menuItem.href
            ? "[&>svg]:fill-[#3AFF4242] text-white"
            : "[&>svg]:fill-slate-500 text-slate-500"
        }`}
        key={`menu-item-${menuItem.href}`}
        onClick={() => setMenuOpen(false)}
      >
        {menuItem.title}
      </Link>
    );
  });

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div
        className={
          "w-full hidden lg:flex flex-row items-center justify-between mt-2 lg:mt-2 gap-2"
        }
      >
        <ZetaGateLogo />

        <div className="flex flex-col-reverse lg:flex-row gap-3">
          <NetworkSelector />
          <ConnectButton />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex lg:hidden  items-center self-center z-50">
        <FaBars className="w-8 h-8" onClick={() => setMenuOpen((prev) => !prev)} />
      </div>
      <div
        className={`fixed self-start top-0 left-0 right-0 h-[100vh] z-[51] bg-black opacity-90 ${
          isMenuOpen ? "block" : "hidden"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <nav
          className={`flex lg:hidden flex-col items-center justify-center gap-10 transition-all overflow-hidden absolute left-0 top-0 z-[52] ${
            isMenuOpen ? "w-full h-[90vh] px-8" : "max-w-[0px] px-0"
          }`}
        >
          <ZetaGateLogo />

          {menu}
        </nav>
      </div>
      <div className="flex flex-col-reverse lg:hidden gap-3">
        <NetworkSelector />
        <ConnectButton />
      </div>
    </div>
  );
};
export default Navbar;
