import { Currency, ERC20Token, Token } from "@/types";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { use, useEffect, useRef, useState } from "react";
import { CurrencyLogo } from "./CurrencyLogo";
import { FaRegStar, FaStar } from "react-icons/fa";
import axios from "axios";
import Loading from "@/assets/images/loading.svg";
import { useAccount, useBalance } from "wagmi";
import { cssTransition, toast } from "react-toastify";
import { motion } from "framer-motion";
import Image from "next/image";
import RightArrowIcon from "@/assets/images/right-arrow.svg";
import { ethers } from "ethers";
import Link from "next/link";
import { zeroAddress } from "viem";

type Props = {
  onCloseModal: () => void;
  routes: any[];
  routesAndSpaces: any[];
  childlist: any[];
  tokens: Currency[];
  routePercentages: any[];
  amountOuts: any[];
  tokenFrom: Currency;
  tokenTo: Currency;
  translateRouteCard: { x: number; y: number; xie: number; yie: number };
};

function RouteCard({
  onCloseModal,
  routes,
  routesAndSpaces,
  childlist,
  tokens,
  routePercentages,
  amountOuts,
  tokenFrom,
  tokenTo,
  translateRouteCard,
}: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [totalAmountIn, setTotalAmountIn] = useState<number>(0);
  const [totalAmountOuts, setTotalAmountOuts] = useState<any[]>([]);

  useEffect(() => {
    if (!amountOuts) return;

    const setRoutesTotalAmountOut = () => {
      let totalAmountOutsTemp = [];

      for (let i = 0; i < routes.length - 1; i++) {
        let totalAmountOut = BigInt(0);

        for (let j = 0; j < routes[i].length; j++) {
          totalAmountOut += BigInt(amountOuts[i][j]);
        }

        totalAmountOutsTemp.push(
          Number(
            ethers.utils.formatUnits(
              totalAmountOut,
              tokens?.find((token) => token?.wrapped.address == routes[i][0].tokenOut)
                ?.decimals!
            )
          ).toFixed(6)
        );
      }

      let totalAmountOutsTempSecond = [];

      for (let i = 0; i < totalAmountOutsTemp.length; i++) {
        totalAmountOutsTempSecond.push(totalAmountOutsTemp[i]);

        if (i + 1 <= totalAmountOutsTemp.length - 1) {
          totalAmountOutsTempSecond.push([]);
        }
      }

      setTotalAmountOuts(totalAmountOutsTempSecond);
    };

    const setRoutesTotalAmountIn = () => {
      let totalAmountIn = BigInt(0);

      for (let j = 0; j < routes[0].length; j++) {
        totalAmountIn += BigInt(routes[0][j].amountIn);
      }

      setTotalAmountIn(
        Number(
          ethers.utils.formatUnits(
            totalAmountIn,
            tokens?.find((token) => token?.wrapped.address == routes[0][0].tokenIn)
              ?.decimals!
          )
        )
      );
    };

    setRoutesTotalAmountOut();
    setRoutesTotalAmountIn();
  }, [amountOuts]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        translateX: translateRouteCard.xie + "%",
        translateY: translateRouteCard.yie + "%",
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        translateX: translateRouteCard.x + "%",
        translateY: translateRouteCard.y + "%",
        scale: 1,
      }}
      exit={{
        opacity: 0,
        translateX: translateRouteCard.xie + "%",
        translateY: translateRouteCard.yie + "%",
        scale: 0.9,
      }}
      transition={{ duration: 0.15, delay: 0.3 }}
      ref={modalRef}
      className={
        "md:p-6 p-4 xl:w-[52rem] lg:w-[30rem] md:w-[24rem] sm:w-[22rem] xs:w-[20rem] w-[95%] lg:max-w-[55%] max-h-[32rem] bg-[rgba(26,29,36,0.75)] backdrop-blur-[52px] rounded-[48px] !m-0"
      }
    >
      <div className="flex justify-between items-center px-4 pt-2 mb-1 text-white">
        <h1 className="text-white text-base sm:text-lg md:text-xl -mb-1">Routing</h1>
        <div
          onClick={() => onCloseModal()}
          className="right-0 z-[9999] font-medium hover:bg-white/10 bg-black/20 transition-all rounded-md flex justify-center items-center cursor-pointer w-8 h-8"
        >
          <FontAwesomeIcon icon={faX} className="w-4 h-4" />
        </div>
      </div>
      <div className="relative sm:mt-6 mt-2 md:py-8 py-2 bg-black bg-opacity-[0.15] routeModalBg rounded-3xl h-[calc(100%-4.5rem)] overflow-auto">
        <div className="md:px-8 px-0 md:min-w-fit md:scale-100 scale-75">
          <div
            className={
              "flex flex-row items-start w-full gap-6 " +
              (routesAndSpaces.length > 1 ? "justify-between" : "justify-evenly")
            }
          >
            {tokenFrom!.symbol === "ETH" && (
              <>
                <div className="flex flex-col justify-center items-center min-w-[6.25rem] max-w-[13.75rem]">
                  <div className="flex flex-col justify-center items-center w-full">
                    <div className="flex flex-row justify-center items-center rounded-full w-[3.25rem] h-[3.25rem] overflow-clip">
                      <Image
                        onClick={() => window.open("https://scrollscan.com/")}
                        src={String(
                          tokens?.find(
                            (token) =>
                              token?.wrapped.address.toLowerCase() ==
                              tokenFrom?.wrapped.address.toLowerCase()
                          )?.logo!
                        )}
                        width={48}
                        height={48}
                        alt=""
                        className="bg-black bg-opacity-[0.15] p-2 hover:cursor-pointer w-full h-full"
                      />
                    </div>
                    <span className="mt-3 text-white text-base">{totalAmountIn} ETH</span>
                  </div>
                </div>
                <RightArrowIcon className="xl:min-w-[2rem] lg:min-w-[2.5rem] min-w-[2.5rem] xl:min-h-[2rem] lg:min-h-[2.5rem] min-h-[2.5rem] xl:w-[2rem] lg:w-[2.5rem] w-[2.5rem] xl:h-[2rem] lg:h-[1.75rem] h-[1.5rem] p-[0.35rem] bg-white mt-8 bg-opacity-5 mx-2 rounded-full" />
              </>
            )}
            {routesAndSpaces?.map((route, index) =>
              route.length > 0 ? (
                <div
                  key={"route-" + index}
                  className="flex flex-col justify-center items-center min-w-fit max-w-[13.75rem]"
                >
                  <div className="flex flex-col justify-center items-center w-full">
                    <div className="flex flex-row justify-center items-center rounded-full w-[3.25rem] h-[3.25rem] overflow-clip">
                      <Image
                        onClick={() =>
                          window.open(
                            "https://scrollscan.com/token/" +
                              route[0].tokenIn.toLowerCase()
                          )
                        }
                        src={String(
                          tokens?.find(
                            (token) =>
                              token?.symbol != "ETH" &&
                              token?.wrapped.address.toLowerCase() ==
                                route[0].tokenIn.toLowerCase()
                          )?.logo!
                        )}
                        width={48}
                        height={48}
                        alt=""
                        className="bg-black bg-opacity-[0.15] p-2 hover:cursor-pointer w-full h-full"
                      />
                    </div>
                    <span className="mt-3 text-white text-base">
                      {(index == 0 ? totalAmountIn : totalAmountOuts[index - 2]) +
                        " " +
                        tokens?.find(
                          (token) =>
                            token?.symbol != "ETH" &&
                            token?.wrapped.address.toLowerCase() ==
                              route[0].tokenIn.toLowerCase()
                        )?.symbol!}
                    </span>
                  </div>
                  {tokenFrom!.symbol === "ETH" && index == 0 && (
                    <div className="flex flex-col justify-start items-center mt-3 p-4 bg-black bg-opacity-[0.15] rounded-2xl">
                      <div className="flex flex-row justify-between items-center min-w-[10.75rem]">
                        <div className="flex flex-row justify-start items-center gap-2 text-white text-base p-1 w-full">
                          <Image
                            src={"/logo.png"}
                            width={48}
                            height={48}
                            alt=""
                            className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"
                          />
                          <Link href={"/"} target="_blank" className="-mb-1">
                            Aggre.io:
                          </Link>
                        </div>
                        <div
                          className={
                            "flex justify-center items-center text-sm min-w-[3rem] h-[1.625rem] border-2 border-opacity-[0.35] bg-opacity-25 rounded-full border-[#61c56f] bg-[#61c56f]"
                          }
                        >
                          <span className={"-mb-1 font-medium text-[#61c56f]"}>100%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {index > 0 && (
                    <div className="flex flex-col justify-start items-center mt-3 p-4 bg-black bg-opacity-[0.15] rounded-2xl w-[13.75rem]">
                      {Array.from(
                        {
                          length:
                            routePercentages[
                              routes.findIndex((currentRoute) => currentRoute == route) -
                                1
                            ].length,
                        },
                        (_, i) => i + 1
                      ).map((child, childIndex) => (
                        <div
                          key={"route-child-" + childIndex}
                          className="flex flex-col justify-between items-center min-w-[11.75rem]"
                        >
                          <div className="flex flex-row justify-between items-center text-white text-base w-full">
                            <div className="flex flex-row justify-start items-center gap-2 text-white text-base p-1 w-full">
                              <Image
                                src={
                                  String(
                                    childlist[
                                      routes[
                                        routes.findIndex(
                                          (currentRoute) => currentRoute == route
                                        ) - 1
                                      ][childIndex].swapType - 1
                                    ].logo!
                                  ) === ""
                                    ? "/logo.png"
                                    : String(
                                        childlist[
                                          routes[
                                            routes.findIndex(
                                              (currentRoute) => currentRoute == route
                                            ) - 1
                                          ][childIndex].swapType - 1
                                        ].logo!
                                      )
                                }
                                width={48}
                                height={48}
                                alt=""
                                className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"
                              />
                              <Link
                                href={String(
                                  childlist[
                                    routes[
                                      routes.findIndex(
                                        (currentRoute) => currentRoute == route
                                      ) - 1
                                    ][childIndex].swapType - 1
                                  ].projectLink!
                                )}
                                target="_blank"
                                className="-mb-1"
                              >
                                {childlist[
                                  routes[
                                    routes.findIndex(
                                      (currentRoute) => currentRoute == route
                                    ) - 1
                                  ][childIndex].swapType - 1
                                ].name + ":"}
                              </Link>
                            </div>
                            <span></span>
                            <div
                              className={
                                "flex justify-center items-center text-sm min-w-[3rem] h-[1.625rem] border-2 border-opacity-[0.35] bg-opacity-25 rounded-full " +
                                (routePercentages[
                                  routes.findIndex(
                                    (currentRoute) => currentRoute == route
                                  ) - 1
                                ][childIndex] > 15
                                  ? routePercentages[
                                      routes.findIndex(
                                        (currentRoute) => currentRoute == route
                                      ) - 1
                                    ][childIndex] > 35
                                    ? "border-[#61c56f] bg-[#61c56f]"
                                    : "border-[#bec561] bg-[#bec561]"
                                  : "border-[#c57861] bg-[#c57861]")
                              }
                            >
                              <span
                                className={
                                  "-mb-1 font-medium " +
                                  (routePercentages[
                                    routes.findIndex(
                                      (currentRoute) => currentRoute == route
                                    ) - 1
                                  ][childIndex] > 15
                                    ? routePercentages[
                                        routes.findIndex(
                                          (currentRoute) => currentRoute == route
                                        ) - 1
                                      ][childIndex] > 35
                                      ? "text-[#61c56f]"
                                      : "text-[#bec561]"
                                    : "text-[#c57861]")
                                }
                              >
                                {routePercentages[
                                  routes.findIndex(
                                    (currentRoute) => currentRoute == route
                                  ) - 1
                                ][childIndex] + "%"}
                              </span>
                            </div>
                          </div>
                          {route.length > 0 &&
                            childIndex >= 0 &&
                            childIndex <
                              routes[
                                routes.findIndex(
                                  (currentRoute) => currentRoute == route
                                ) - 1
                              ].length -
                                1 && (
                              <div className="bg-white bg-opacity-5 w-full my-3 h-[0.125rem] rounded-full"></div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div key={"route-right-icon-" + index}>
                  <RightArrowIcon className="xl:min-w-[2rem] lg:min-w-[2.5rem] min-w-[2.5rem] xl:min-h-[2rem] lg:min-h-[2.5rem] min-h-[2.5rem] xl:w-[2rem] lg:w-[2.5rem] w-[2.5rem] xl:h-[2rem] lg:h-[1.75rem] h-[1.5rem] p-[0.425rem] bg-white mt-8 bg-opacity-5 mx-2 rounded-full" />
                </div>
              )
            )}
            {tokenTo!.symbol === "ETH" && (
              <>
                <RightArrowIcon className="xl:min-w-[2rem] lg:min-w-[2.5rem] min-w-[2.5rem] xl:min-h-[2rem] lg:min-h-[2.5rem] min-h-[2.5rem] xl:w-[2rem] lg:w-[2.5rem] w-[2.5rem] xl:h-[2rem] lg:h-[1.75rem] h-[1.5rem] p-[0.425rem] bg-white mt-8 bg-opacity-5 mx-2 rounded-full" />
                <div className="flex flex-col justify-center items-center min-w-[6.25rem] max-w-[13.75rem]">
                  <div className="flex flex-col justify-center items-center w-full">
                    <div className="flex flex-row justify-center items-center rounded-full w-[3.25rem] h-[3.25rem] overflow-clip">
                      <Image
                        onClick={() => window.open("https://scrollscan.com/")}
                        src={String(
                          tokens?.find(
                            (token) =>
                              token?.wrapped.address.toLowerCase() ==
                              tokenTo?.wrapped.address.toLowerCase()
                          )?.logo!
                        )}
                        width={48}
                        height={48}
                        alt=""
                        className="bg-black bg-opacity-[0.15] p-2 hover:cursor-pointer w-full h-full"
                      />
                    </div>
                    <span className="mt-3 text-white text-base">
                      {tokenFrom!.symbol == "WETH"
                        ? totalAmountIn
                        : totalAmountOuts[totalAmountOuts.length - 1]}{" "}
                      ETH
                    </span>
                  </div>
                  <div className="flex flex-col justify-start items-center mt-3 p-4 bg-black bg-opacity-[0.15] rounded-2xl">
                    <div className="flex flex-row justify-between items-center min-w-[10.75rem]">
                      <div className="flex flex-row justify-start items-center gap-2 text-white text-base p-1 w-full">
                        <Image
                          src={"/logo.png"}
                          width={48}
                          height={48}
                          alt=""
                          className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"
                        />
                        <Link href={"/"} target="_blank" className="-mb-1">
                          Aggre.io:
                        </Link>
                      </div>
                      <div
                        className={
                          "flex justify-center items-center text-sm min-w-[3rem] h-[1.625rem] border-2 border-opacity-[0.35] bg-opacity-25 rounded-full border-[#61c56f] bg-[#61c56f]"
                        }
                      >
                        <span className={"-mb-1 font-medium text-[#61c56f]"}>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default RouteCard;
