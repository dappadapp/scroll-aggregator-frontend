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
    title: "Trade",
    href: "/",
  },
  {
    title: "Dao",
    href: "/",
  },
  {
    title: "Earn",
    href: "/",
  },
  {
    title: "Buy Crypto",
    href: "/",
  },
  // {
  //   title: "Stats",
  //   href: "/stats",
  // },
  // {
  //   title: "Docs",
  //   href: "/docs",
  // },
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
  const menuDesktop = menuItems.map((menuItem) => {
    return (
      <Link
        href={menuItem.href || ""}
        className={` ${
          path === menuItem.href
            ? "cursor-not-allowed"
            : "cursor-pointer  hover:bg-opacity-40 hover:bg-slate-100"
        } flex  items-center  transition-all gap-2 p-3 rounded-lg text-[#FFF0DD] text-[20px] leading-[120%]`}
        key={`menu-item-${menuItem.title}`}
      >
        {menuItem.title}
      </Link>
    );
  });
  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div
        className={
          "w-full hidden lg:flex flex-row lg:mb-10 items-center justify-between mt-2 lg:mt-5 gap-2"
        }
      >
        <div className={"hidden lg:flex gap-12 flex-row items-center justify-start"}>
          <Link href={"https://aggre.io"}>
            <ZetaGateLogo />
          </Link>
          {menuDesktop}
        </div>
        <div className="flex flex-col-reverse items-center lg:flex-row gap-3">
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
