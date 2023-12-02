import { Currency, ERC20Token, Token } from "@/types";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { CurrencyLogo } from "./CurrencyLogo";
import { FaRegStar, FaStar } from "react-icons/fa";
import axios from "axios";
import Loading from "@/assets/images/loading.svg";
import { useAccount, useBalance } from "wagmi";
import { toast } from "react-toastify";
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
};

function RouteModal({ onCloseModal, routes, routesAndSpaces, childlist, tokens, routePercentages, amountOuts, tokenFrom }: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [totalAmountIn, setTotalAmountIn] = useState<number>(0);
  const [totalAmountOuts, setTotalAmountOuts] = useState<any[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCloseModal]);

  useEffect(() => {
    if(!amountOuts) return;

    const setRoutesTotalAmountOut = () => {
      let totalAmountOutsTemp = [];

      for(let i = 0; i < routes.length - 1; i++) {
        let totalAmountOut = BigInt(0);

        for(let j = 0; j < routes[i].length; j++) {
          totalAmountOut += BigInt(amountOuts[i][j]);
        }

        totalAmountOutsTemp.push(Number(ethers.utils.formatUnits(totalAmountOut, tokens?.find(token => token?.wrapped.address == routes[i][0].tokenOut)?.decimals!)).toFixed(4));
      }

      let totalAmountOutsTempSecond = [];

      for (let i = 0; i < totalAmountOutsTemp.length; i++) {
        totalAmountOutsTempSecond.push(totalAmountOutsTemp[i]);
      
        if (i + 1 <= totalAmountOutsTemp.length - 1) {
          totalAmountOutsTempSecond.push([]);
        }
      }

      setTotalAmountOuts(totalAmountOutsTempSecond);
    }

    const setRoutesTotalAmountIn = () => {
        let totalAmountIn = BigInt(0);

        for(let j = 0; j < routes[0].length; j++) {
          totalAmountIn += BigInt(routes[0][j].amountIn);
        }

        setTotalAmountIn(Number(ethers.utils.formatUnits(totalAmountIn, tokens?.find(token => token?.wrapped.address == routes[0][0].tokenIn)?.decimals!)));
    }

    setRoutesTotalAmountOut();
    setRoutesTotalAmountIn();
  }, [amountOuts])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={
        "z-[9999] fixed w-full h-full lg:body-lg modal-bg flex items-center overflow-hidden justify-center top-0 left-0"
      }
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        ref={modalRef}
        className={
          "z-[9999] p-6 min-w-[32rem] max-h-[32rem] bg-[rgba(26,29,36,1)] backdrop-blur-[52px] rounded-[48px]"}
      >
        <div className="flex justify-between items-center px-4 pt-2 mb-1 text-white">
          <h1 className="text-white text-lg sm:text-xl md:text-2xl -mb-1">Routing</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium hover:bg-white/10 bg-black/20 transition-all rounded-md flex justify-center items-center cursor-pointer w-10 h-10"
          >
            <FontAwesomeIcon icon={faX} className="w-4 h-4" />
          </div>
        </div>
        <div className="relative mt-6 py-10 px-16 bg-black bg-opacity-[0.15] routeModalBg rounded-3xl w-full h-[calc(100%-4.5rem)]">
          <div className="flex flex-row justify-between items-start w-full gap-6">
            {tokenFrom!.symbol === "ETH" && (
              <>
                <div className="flex flex-col justify-center items-center min-w-[6.25rem] max-w-[17.5rem]">
                  <div className="flex flex-col justify-center items-center w-full">
                    <div className="flex flex-row justify-center items-center rounded-full w-[4.25rem] h-[4.25rem] overflow-clip">
                      <Image onClick={() => window.open("https://scrollscan.com/")} src={String(tokens?.find(token => (token?.wrapped.address == tokenFrom?.wrapped.address))?.logo!)} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] p-3 hover:cursor-pointer w-full h-full"/> 
                    </div>
                    <span className="mt-3 text-white text-base">{totalAmountIn} ETH</span>
                  </div>
                </div>
                <RightArrowIcon className="xl:min-w-[2rem] lg:min-w-[2.5rem] min-w-[2.5rem] xl:min-h-[2rem] lg:min-h-[2.5rem] min-h-[2.5rem] xl:w-[2rem] lg:w-[2.5rem] w-[2.5rem] xl:h-[2rem] lg:h-[1.75rem] h-[1.5rem] p-[0.35rem] bg-white mt-8 bg-opacity-5 mx-8 rounded-full"/>
              </>
            )}
            {routesAndSpaces?.map((route, index) => (
              route.length > 0 ? (
                <div key={"route-" + index} className="flex flex-col justify-center items-center min-w-[6.25rem] max-w-[17.5rem]">
                  <div className="flex flex-col justify-center items-center w-full">
                    <div className="flex flex-row justify-center items-center rounded-full w-[4.25rem] h-[4.25rem] overflow-clip">
                      <Image onClick={() => window.open("https://scrollscan.com/token/" + route[0].tokenIn)} src={String(tokens?.find(token => (token?.symbol != "ETH") && (token?.wrapped.address == route[0].tokenIn))?.logo!)} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] p-3 hover:cursor-pointer w-full h-full"/> 
                    </div>
                    <span className="mt-3 text-white text-base">{(index == 0 ? totalAmountIn : totalAmountOuts[index - 2]) + " " + tokens?.find(token => (token?.symbol != "ETH") && (token?.wrapped.address == route[0].tokenIn))?.symbol!}</span>
                  </div>
                  {tokenFrom!.symbol === "ETH" && index == 0 && (
                    <div className="flex flex-col justify-start items-center mt-3 p-4 bg-black bg-opacity-[0.15] rounded-2xl">
                      <div className="flex flex-col justify-between items-center w-full">
                        <div className="flex flex-row justify-between items-center gap-2 text-white text-base p-1 w-full">
                          <div className="flex flex-row justify-start items-center gap-2 text-white text-base p-1 w-full">
                            <Image src={"/logo.png"} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"/> 
                            <Link href={"/"} target="_blank" className="-mb-1">Aggre.io:</Link>
                          </div>
                          <div className={"flex justify-center items-center text-sm min-w-[3rem] h-[1.625rem] border-2 border-opacity-[0.35] bg-opacity-25 rounded-full border-[#61c56f] bg-[#61c56f]"}>
                            <span className={"-mb-1 font-medium text-[#61c56f]"}>100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {index > 0 && (
                    <div className="flex flex-col justify-start items-center mt-3 p-4 bg-black bg-opacity-[0.15] rounded-2xl">
                      {Array.from({length: routes[index - 2].length}, (_, i) => i + 1).map((child, childIndex) => (
                        <div key={"route-child-" + childIndex} className="flex flex-col justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center gap-2 text-white text-base p-1 w-full">
                            <div className="flex flex-row justify-start items-center gap-2 text-white text-base p-1 w-full">
                              <Image src={String(childlist[routes[index - 2][childIndex].swapType - 1].logo!) === "" ? "/logo.png" : String(childlist[routes[index - 2][childIndex].swapType - 1].logo!)} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"/> 
                              <Link href={String(childlist[routes[index - 2][childIndex].swapType - 1].projectLink!)} target="_blank" className="-mb-1">{childlist[routes[index - 2][childIndex].swapType - 1].name + ":"}</Link>
                            </div>
                            <div className={"flex justify-center items-center text-sm min-w-[3rem] h-[1.625rem] border-2 border-opacity-[0.35] bg-opacity-25 rounded-full " + (routePercentages[index - 2][childIndex] > 15 ? (routePercentages[index - 2][childIndex] > 35 ? "border-[#61c56f] bg-[#61c56f]" : "border-[#bec561] bg-[#bec561]") : "border-[#c57861] bg-[#c57861]")}>
                              <span className={"-mb-1 font-medium " + (routePercentages[index - 2][childIndex] > 15 ? (routePercentages[index - 2][childIndex] > 35 ? "text-[#61c56f]" : "text-[#bec561]") : "text-[#c57861]")}>{routePercentages[index - 2][childIndex] + "%"}</span>
                            </div>
                          </div>
                          {route.length > 0 && childIndex >= 0 && childIndex < routes[index - 2].length - 1 && (
                            <div className="bg-white bg-opacity-5 w-full my-2 h-[0.125rem] rounded-full"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ):(
                <div key={"route-right-icon-" + index}>
                  <RightArrowIcon className="xl:min-w-[2rem] lg:min-w-[2.5rem] min-w-[2.5rem] xl:min-h-[2rem] lg:min-h-[2.5rem] min-h-[2.5rem] xl:w-[2rem] lg:w-[2.5rem] w-[2.5rem] xl:h-[2rem] lg:h-[1.75rem] h-[1.5rem] p-[0.35rem] bg-white mt-8 bg-opacity-5 mx-8 rounded-full"/>
                </div>
              )
            ))}
          </div>
        </div>
      </motion.div>  
    </motion.div>
  );
}

export default RouteModal;
