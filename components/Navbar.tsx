"use client";
import React, { Fragment, useEffect, useState } from "react";
import ZetaGateLogo from "./Logo";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import NetworkSelector from "./NetworkSelector";
import { FaBars } from "react-icons/fa";
import ConnectButton from "./ConnectButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

type Props = {};

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
    title: "Leaderboard",
    href: "/leaderboard",
    type: "",
    active: true,
  },
  {
    title: "Stats",
    href: "/stats",
    type: "",
    active: true,
  },
  {
    title: "Dao",
    href: "/dao",
    active: false,
  },
  // {
  //   title: "Earn",
  //   href: "/dao",
  //   active: false,
  // },
  // {
  //   title: "Buy Crypto",
  //   href: "/",
  // },

  // {
  //   title: "Docs",
  //   href: "/docs",
  // },
];
const Navbar: React.FC<Props> = (props) => {
  const path = usePathname();
  const [isMenuClosed, setMenuClosed] = useState(true);
  const [isMenuOpenTransition, setMenuOpenTransition] = useState(false);
  // useEffect(() => {
  //   // Change zoom level on mount
  //   (document.getElementById("container-div")?.style as any).zoom = "80%";
  // }, []);
  const menu = menuItems.map((menuItem) => {
    return (
      <Link
        href={menuItem.active ? menuItem.href : ""}
        className={`flex items-center xs:text-base text-sm bg-white bg-opacity-5 xs:px-6 xs:py-3 px-4 py-2 rounded-lg transition-all hover:text-white ${
          path === menuItem.href
            ? "[&>svg]:fill-[#3AFF4242] text-white"
            : "[&>svg]:fill-[#3AFF4242] text-white"
        }` + (!menuItem.active ? " opacity-25 pointer-events-none" : "")}
        key={`menu-item-${menuItem.href}`}
      >
        {menuItem.title}
      </Link>
    );
  });

  const menuDesktop = menuItems.filter((item) => item.type !== "mobile").map((menuItem) => {
    return (
      <Link
        href={menuItem.active ? menuItem.href : ""}
        className={` ${
          path === menuItem.href
            ? "text-opacity-100 hover:text-opacity-95 hover:bg-opacity-40 hover:bg-slate-100"
            : "cursor-pointer text-opacity-40 hover:text-opacity-95 hover:bg-opacity-40 hover:bg-slate-100"
        } ${
          !menuItem.active && "tooltip"
        } flex items-center px-4 py-2 xl:px-6 xl:py-3 transition-all gap-2 rounded-lg text-[#FFF0DD] xl:text-lg text-base leading-[120%]`}
        key={`menu-item-${menuItem.title}`}
      >
        <span className="-mb-1">{menuItem.title}</span>
        <span className={`${menuItem.active ? "hidden" : "tooltiptext text-base -mt-2"} `}>
          Soon
        </span>
      </Link>
    );
  });

  const handleMenuClick = () => {
    if(isMenuClosed) {
      setMenuClosed(false);
      setTimeout(() => setMenuOpenTransition(true), 150);
    } else {
      setMenuOpenTransition(false);
      setTimeout(() => setMenuClosed(true), 150);
    }
  }

  return (
    <div className="flex flex-col items-center xs:px-0 px-4 top-0 justify-between w-full sm:gap-0 gap-4">
      <div className="w-full flex flex-row lg:mb-1 items-center justify-between mt-2 lg:mt-3 gap-2">
        <div className={"flex flex-row items-center justify-start"}>
          <Link href={"https://aggre.io"} className="xl:w-[12.5rem] md:w-[10rem] sm:w-[8.75rem] w-[7.5rem] md:-mt-4 md:my-2 -mt-2 my-1">
            <ZetaGateLogo />
          </Link>
          <div className="hidden lg:flex flex-row ml-4 xl:gap-2 gap-1">
            {menuDesktop}
          </div>
        </div>
        <div className="flex flex-row items-center xl:gap-6 gap-4">
          <div className="flex lg:hidden items-center text-[#FFF0DD]/90 self-center lg:z-10 sm:z-0 z-10 hover:cursor-pointer">
            <FaBars className="sm:w-7 sm:h-7 w-6 h-6" onClick={() => handleMenuClick()} />
          </div>
          <div
            className={`absolute block z-[5] w-full lg:hidden transition-all duration-150 self-start top-0 left-0 xs:pt-[5rem] pt-[3.75rem] xs:pb-[7.5rem] pb-[2.5rem] min-h-[100%] mobile-menu-bg ${
              (isMenuOpenTransition ? "opacity-95 " : "opacity-0 ") + (isMenuClosed ? "hidden ": "flex-1 ")
            }`}
          >
            <div className="absolute top-[3.25rem] right-[3.25rem] lg:hidden sm:flex hidden items-center text-[#FFF0DD]/90 self-center hover:cursor-pointer">
              <FaBars className="sm:w-8 sm:h-8 w-6 h-6" onClick={() => handleMenuClick()} />
            </div>
            <nav
              className={"flex lg:hidden flex-col items-center justify-center gap-6 transition-all w-full px-8 " + (isMenuOpenTransition ? "scale-100 " : "scale-95 ")}
            >
              <div className="w-[10rem] xs:my-6 mb-2">
                <ZetaGateLogo />
              </div>
              {menu}
              <div className="flex flex-col gap-2 justify-center items-center w-full xs:text-base text-sm xs:mt-8 mt-4">
                <p className={"text-[#FFF0DD]"}>2023 © aggre!</p>
                <Link href={"https://dapplabs.tech/"} className={"cursor-pointer text-[#FFF0DD]"}>
                  Powered By DappLabs
                </Link>
                <div className={"flex gap-6 xs:text-2xl text-xl text-gray-400 xs:mt-4 mt-2"}>
                  <a
                    href="https://twitter.com/aggreio"
                    target="_blank"
                    className={"hover:text-gray-100 transition-all"}
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a
                    href={"https://discord.gg/dwBpDBVewX"}
                    target="_blank"
                    className={"hover:text-gray-100 transition-all"}
                  >
                    <FontAwesomeIcon icon={faDiscord} />
                  </a>
                </div>
              </div>
            </nav>
          </div>
          <div className="hidden sm:flex flex-row justify-center items-center xl:gap-6 gap-4">
            <NetworkSelector />
            <ConnectButton />
          </div>
        </div>
      </div>
      <div className="flex sm:hidden flex-row justify-center items-center xl:gap-6 gap-4">
        <NetworkSelector />
        <ConnectButton />
      </div>
    </div>
  );
};
export default Navbar;
