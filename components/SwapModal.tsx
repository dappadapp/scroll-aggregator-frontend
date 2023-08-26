import React, { useEffect, useState } from "react";
import { SwapToken } from "./SwapToken";
import { networks } from "@/utils/networks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faX } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";

type Props = {
  onCloseModal: () => void;
  refCode?: string;
};

function SwapModal({ onCloseModal }: Props) {
  return (
    <div
      className={
        "z-[999] absolute w-screen h-[123vh] md:h-[110vh] bg-white flex items-center justify-center backdrop-blur-2xl bg-opacity-10 top-0 left-0"
      }
    >
      <div
        className={
          "p-8 max-w-[90vw] min-w-[300px] md:min-w-[500px] bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
        }
      >
        <div className="flex justify-between mb-4">
          <h1 className={"text-sm md:text-lg text-[#C4C4CA]"}>Review swap details</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium hover:bg-white/20 transition-all rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            <FontAwesomeIcon icon={faX} />
          </div>
        </div>
        <div className="flex justify-between mb-10 items-center">
          <SwapToken value={0.002} token="ETH" image={`/chains/${networks[0].image}`} />
          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-[#AAA]"
            width={30}
            height={30}
          />
          <SwapToken value={0.0001} token="BTC" image={`/chains/${networks[1].image}`} />
        </div>
        <div className="w-full bg-[#AAA] h-[1px]"></div>
        <div className="my-10 text-xs md:text-sm flex flex-col gap-2 text-[#AAA]">
          <div className="flex justify-between">
            <span>Trading Fee</span>
            <span>0 ETH ( 10$ )</span>
          </div>
          <div className="flex justify-between">
            <span>Minimum Receive</span>
            <span>1.100 USDC</span>
          </div>
          <div className="flex justify-between">
            <span>Slippage tolerance</span>
            <span>1%</span>
          </div>
          <div className="flex justify-between">
            <span>Rate</span>
            <span>1 ETH = 1000 USDC</span>
          </div>
          <div className="flex justify-between">
            <span>Liquidity source</span>
            <span>WOOFI</span>
          </div>
        </div>
        <Button>Confirm Swap</Button>
      </div>
    </div>
  );
}

export default SwapModal;
