import React, { useEffect, useState } from "react";
import { erc20ABI, useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { networks } from "@/constants/networks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faX } from "@fortawesome/free-solid-svg-icons";
import { SwapToken } from "@/components/SwapToken";
import { SwapSteps } from "@/components/SwapSteps";
import { Currency, SWAP_TYPE } from "@/types";
import addresses from "@/constants/contracts";
import SwapButton, { SwapParam } from "./SwapButton";
import AllowButton from "./AllowButton";

type Props = {
  onCloseModal: () => void;
  tokenA: Currency,
  tokenB: Currency,
  amountA: number,
  amountB: number,
};

function SwapModal({
  onCloseModal,
  tokenA,
  tokenB,
  amountA,
  amountB
}: Props) {  
  const { address: account, isConnected } = useAccount();
  const { data: allowance, refetch } = useContractRead({
    address: tokenA.wrapped.address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [account!, addresses.aggregatorContract],
    enabled: !!account && tokenA.isToken
  });


  return (
    <div
      className={
        "z-[999] fixed w-screen h-[100vh] bg-white flex items-center justify-center backdrop-blur-2xl bg-opacity-10 top-0 left-0"
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
          <SwapToken value={amountA} currency={tokenA} />
          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-[#AAA]"
            width={30}
            height={30}
          />
          <SwapToken value={amountB} currency={tokenB} />
        </div>
        <div className="w-full bg-[#AAA] h-[1px] my-6"></div>
        <div className="flex gap-2 w-full justify-center">
          <SwapSteps
            hasNext={true}
            type="swap"
            tokenImage={`/chains/${networks[0].image}`}
            value={0.001}
          />
          <SwapSteps
            hasNext={true}
            type="bridge"
            tokenImage={`/chains/${networks[0].image}`}
            value={0.1}
          />
          <SwapSteps tokenImage={`/chains/${networks[0].image}`} value={0.1} />
        </div>
        <div className="my-10 text-xs md:text-sm flex flex-col gap-2 text-[#AAA]">
          <div className="flex justify-between">
            <span>Trading Fee</span>
            <span>0 ETH (0$)</span>
          </div>
          <div className="flex justify-between">
            <span>Minimum Receive</span>
            <span> {1000.1} USDC</span>
          </div>
          <div className="flex justify-between">
            <span>Slippage tolerance</span>
            <span>20%</span>
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
        {allowance !== undefined && allowance < BigInt(amountA * (10 ^ tokenA.decimals)) ? 
        <AllowButton tokenIn={tokenA} amountIn={amountA} onSuccess={refetch} />
        :
        <SwapButton swapParam={{
          poolAddress: tokenA.wrapped.address, // temporary
          tokenIn: tokenA.wrapped.address,
          tokenOut: tokenB.wrapped.address,
          amountIn: amountA,
          amountOutMin: amountB,
          swapType: SWAP_TYPE.ECHO,
          fee: 0
        }} />
        }
      </div>
    </div>
  );
}

export default SwapModal;
