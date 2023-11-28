import { Currency } from "@/types";
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

type Props = {
  onCloseModal: () => void;
  routeList: Currency[];
};

function RouteModal({ onCloseModal, routeList }: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);

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
        <div className="relative mt-6 p-10 bg-black bg-opacity-[0.15] rounded-3xl w-full h-[calc(100%-4.5rem)]">
          <div className="flex flex-row justify-between items-start w-full gap-6">
            <div className="flex flex-col justify-center items-center min-w-[6.25rem] max-w-[12.5rem] hover:cursor-pointer">
              <div onClick={() => window.open("/")} className="flex flex-col justify-center items-center w-full hover:cursor-pointer">
                <div className="flex flex-row justify-center items-center w-full">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[4.25rem] h-[4.25rem]"/> 
                </div>
                <span className="mt-4 text-white text-base">1.0000 ETH</span>
              </div>
            </div>
            <RightArrowIcon className="min-w-[2rem] min-h-[2rem] mt-[1.625rem] w-[2rem] h-[2rem] p-[0.25rem] bg-white bg-opacity-5 rounded-full"/>
            <div className="flex flex-col justify-center items-center min-w-[6.25rem] max-w-[12.5rem]">
              <div onClick={() => window.open("/")} className="flex flex-col justify-center items-center w-full hover:cursor-pointer">
                <div className="flex flex-row justify-center items-center w-full">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[4.25rem] h-[4.25rem]"/> 
                </div>
                <span className="mt-4 text-white text-base">1.0000 WETH</span>
              </div>
              <div className="flex flex-col justify-start items-center gap-3 mt-3 p-4 bg-black bg-opacity-[0.15] rounded-2xl">
                <div className="flex flex-row justify-between items-center gap-2 text-white text-base p-1">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"/> 
                  <span className="-mb-1">Aggre.io:</span>
                  <div className="flex justify-center items-center text-base min-w-[3.75rem] h-[1.75rem] border-2 border-[#61c56f] border-opacity-[0.35] bg-[#61c56f] bg-opacity-25 rounded-full">
                    <span className="-mb-1 text-[#61c56f] font-medium">100%</span>
                  </div>
                </div>
              </div>
            </div>
            <RightArrowIcon className="min-w-[2rem] min-h-[2rem] mt-[1.625rem] w-[2rem] h-[2rem] p-[0.25rem] bg-white bg-opacity-5 rounded-full"/>
            <div className="flex flex-col justify-center items-center min-w-[6.25rem] max-w-[12.5rem]">
              <div onClick={() => window.open("/")} className="flex flex-col justify-center items-center w-full hover:cursor-pointer">
                <div className="flex flex-row justify-center items-center w-full">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[4.25rem] h-[4.25rem]"/> 
                </div>
                <span className="mt-4 text-white text-base">2000.0000 USDT</span>
              </div>
              <div className="flex flex-col justify-start items-center gap-3 mt-3 p-4 bg-black bg-opacity-[0.15] rounded-2xl">
                <div className="flex flex-row justify-between items-center gap-2 text-white text-base p-1 w-full">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"/> 
                  <span className="-mb-1">UzuuunİsimliDex1:</span>
                  <div className="flex justify-center items-center text-base min-w-[3.75rem] h-[1.75rem] border-2 border-[#61c56f] border-opacity-[0.35] bg-[#61c56f] bg-opacity-25 rounded-full">
                    <span className="-mb-1 text-[#61c56f] font-medium">50%</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-5 w-full h-[0.125rem] rounded-full"></div>
                <div className="flex flex-row justify-between items-center gap-2 text-white text-base p-1 w-full">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"/> 
                  <span className="-mb-1">KisaİsimliDex1:</span>
                  <div className="flex justify-center items-center text-base min-w-[3.75rem] h-[1.75rem] border-2 border-[#bec561] border-opacity-[0.35] bg-[#bec561] bg-opacity-25 rounded-full">
                    <span className="-mb-1 text-[#bec561] font-medium">35%</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-5 w-full h-[0.125rem] rounded-full"></div>
                <div className="flex flex-row justify-between items-center gap-2 text-white text-base p-1 w-full">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"/> 
                  <span className="-mb-1">KisaİsimliDex1:</span>
                  <div className="flex justify-center items-center text-base min-w-[3.75rem] h-[1.75rem] border-2 border-[#c57861] border-opacity-[0.35] bg-[#c57861] bg-opacity-25 rounded-full">
                    <span className="-mb-1 text-[#c57861] font-medium">15%</span>
                  </div>
                </div>
              </div>
            </div>
            <RightArrowIcon className="min-w-[2rem] min-h-[2rem] mt-[1.625rem] w-[2rem] h-[2rem] p-[0.25rem] bg-white bg-opacity-5 rounded-full"/>
            <div className="flex flex-col justify-center items-center min-w-[6.25rem] max-w-[12.5rem]">
              <div onClick={() => window.open("/")} className="flex flex-col justify-center items-center w-full hover:cursor-pointer">
                <div className="flex flex-row justify-center items-center w-full">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[4.25rem] h-[4.25rem]"/> 
                </div>
                <span className="mt-4 text-white text-base">2000.0000 USDC</span>
              </div>
              <div className="flex flex-col justify-start items-center gap-3 mt-3 p-4 bg-black bg-opacity-[0.15] rounded-2xl">
                <div className="flex flex-row justify-between items-center gap-2 text-white text-base p-1 w-full">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"/> 
                  <span className="-mb-1">KisaİsimliDex1:</span>
                  <div className="flex justify-center items-center text-base min-w-[3.75rem] h-[1.75rem] border-2 border-[#61c56f] border-opacity-[0.35] bg-[#61c56f] bg-opacity-25 rounded-full">
                    <span className="-mb-1 text-[#61c56f] font-medium">50%</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-5 w-full h-[0.125rem] rounded-full"></div>
                <div className="flex flex-row justify-between items-center gap-2 text-white text-base p-1 w-full">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"/> 
                  <span className="-mb-1">KisaİsimliDex1:</span>
                  <div className="flex justify-center items-center text-base min-w-[3.75rem] h-[1.75rem] border-2 border-[#bec561] border-opacity-[0.35] bg-[#bec561] bg-opacity-25 rounded-full">
                    <span className="-mb-1 text-[#bec561] font-medium">35%</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-5 w-full h-[0.125rem] rounded-full"></div>
                <div className="flex flex-row justify-between items-center gap-2 text-white text-base p-1 w-full">
                  <Image src={""} width={48} height={48} alt="" className="bg-black bg-opacity-[0.15] rounded-full w-[1.25rem] h-[1.25rem]"/> 
                  <span className="-mb-1">KisaİsimliDex1:</span>
                  <div className="flex justify-center items-center text-base min-w-[3.75rem] h-[1.75rem] border-2 border-[#c57861] border-opacity-[0.35] bg-[#c57861] bg-opacity-25 rounded-full">
                    <span className="-mb-1 text-[#c57861] font-medium">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>  
    </motion.div>
  );
}

export default RouteModal;
