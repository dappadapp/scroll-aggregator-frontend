import React, { useEffect, useMemo, useState } from "react";
import { erc20ABI, useAccount, useContractRead } from "wagmi";
import { parseUnits } from "viem";
import { networks } from "@/constants/networks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faX } from "@fortawesome/free-solid-svg-icons";
import { SwapToken } from "@/components/SwapToken";
import { SwapSteps } from "@/components/SwapSteps";
import { Currency, SWAP_TYPE } from "@/types";
import useContract from "@/hooks/useContract";
import SwapButton, { SwapParam } from "./SwapButton";
import AllowButton from "./AllowButton";
import { UNISWAP_DEFAULT_FEE } from "@/constants/contracts";


type Props = {
  onCloseModal: () => void;
  pool: string,
  tokenA: Currency,
  tokenB: Currency,
  amountA: number,
  amountB: number,
  swapType: SWAP_TYPE
};

function SwapModal({
  onCloseModal,
  pool,
  tokenA,
  tokenB,
  amountA,
  amountB,
  swapType
}: Props) {  
  const { address: account, isConnected } = useAccount();
  const contractAddr = useContract();
  const { data: allowance, refetch } = useContractRead({
    address: tokenA.wrapped.address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [account!, contractAddr!.contract],
    enabled: !!contractAddr && !!account && tokenA.isToken
  });

  const bigAmountA = useMemo(() => {
    return parseUnits(amountA.toString(), tokenA.decimals)
  }, [amountA, tokenA])

  const bigAmountB = useMemo(() => {
    return parseUnits(amountB.toString(), tokenB.decimals)
  }, [amountB, tokenB])

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
            value={amountA}
          />
     
          <SwapSteps tokenImage={`/chains/${networks[0].image}`} value={amountB} />
        </div>
        <div className="my-10 text-xs md:text-sm flex flex-col gap-2 text-[#AAA]">
          <div className="flex justify-between">
            <span>Trading Fee</span>
            <span>0 ETH (0$)</span>
          </div>
          <div className="flex justify-between">
            <span>Minimum Receive</span>
            <span> {amountB} Currency TODO</span>
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
            <span>SyncSwap</span>
          </div>
        </div>
        {!tokenA.isNative && (!allowance || allowance < bigAmountA) ? 
        <AllowButton tokenIn={tokenA} amountIn={bigAmountA} onSuccess={refetch} />
        :
        <SwapButton 
          swapParam={{
            poolAddress: pool,
            tokenIn: tokenA.wrapped.address,
            tokenOut: tokenB.wrapped.address,
            amountIn: bigAmountA,
            amountOutMin: bigAmountB,
            swapType: swapType,
            fee: swapType === SWAP_TYPE.UNISWAP ? UNISWAP_DEFAULT_FEE : 0,
          }}
          tokenIn={tokenA}
          tokenOut={tokenB}
        />
        }
      </div>
    </div>
  );
}

export default SwapModal;
