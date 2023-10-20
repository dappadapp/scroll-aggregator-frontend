"use client";
import React, { Fragment, useEffect, useState } from "react";
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
    active: true,
  },
  {
    title: "Bridge",
    href: "/bridge",
    type: "",
    active: true,
  },
  {
    title: "Dao",
    href: "/dao",
    active: false,
  },
  {
    title: "Earn",
    href: "/dao",
    active: false,
  },
  // {
  //   title: "Buy Crypto",
  //   href: "/",
  // },
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
  useEffect(() => {
    // Change zoom level on mount
    (document.getElementById("container-div")?.style as any).zoom = "80%";
  }, []);
  const menu = menuItems.map((menuItem) => {
    return (
      <Link
        href={menuItem.href || ""}
        className={`flex items-center gap-2 transition-all hover:text-white ${
          path === menuItem.href
            ? "[&>svg]:fill-[#3AFF4242] text-white"
            : "[&>svg]:fill-[#3AFF4242] text-white"
        }`}
        key={`menu-item-${menuItem.href}`}
        onClick={() => setMenuOpen(false)}
      >
        {menuItem.title}
      </Link>
    );
  });
  const menuDesktop = menuItems
    .filter((item) => item.type !== "mobile")
    .map((menuItem) => {
      return (
        <Link
          href={menuItem.active ? menuItem.href : ""}
          className={` ${
            path === menuItem.href
              ? "text-opacity-100"
              : "cursor-pointer text-opacity-40 hover:text-opacity-95 hover:bg-opacity-40 hover:bg-slate-100"
          } ${
            !menuItem.active && "tooltip"
          } flex items-center px-6 py-3 transition-all gap-2 mt-6 rounded-lg text-[#FFF0DD] text-[20px] leading-[120%]`}
          key={`menu-item-${menuItem.title}`}
        >
          <span>{menuItem.title}</span>
          <span className={`${menuItem.active ? "hidden" : "tooltiptext text-sm"} `}>
            Soon
          </span>
        </Link>
      );
    });
  return (
    <div className="flex flex-row items-center top-0 justify-between w-full">
      <div
        className={
          "w-full hidden lg:flex flex-row lg:mb-1 items-center justify-between mt-2 lg:mt-3 gap-2"
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
      <div className="flex flex-row lg:hidden gap-3">
        <NetworkSelector />
        <ConnectButton />
      </div>
    </div>
  );
};
export default Navbar;
