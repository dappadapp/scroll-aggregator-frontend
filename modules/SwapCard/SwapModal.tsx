import React, { use, useEffect, useMemo, useState } from "react";
import { erc20ABI, useAccount, useContractRead } from "wagmi";
import { parseUnits } from "viem";
import { networks } from "@/constants/networks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faX } from "@fortawesome/free-solid-svg-icons";
import { SwapToken } from "@/components/SwapToken";
import { SwapSteps } from "@/components/SwapSteps";
import { Currency, SWAP_TYPE, swapTypeMapping } from "@/types";
import useContract from "@/hooks/useContract";
import SwapButton, { SwapParam } from "./SwapButton";
import AllowButton from "./AllowButton";
import { UNISWAP_DEFAULT_FEE } from "@/constants/contracts";
import { fetchFeeData } from "@wagmi/core";
import { useNetwork } from "wagmi";
import { generatePath } from "@/utils/path";
import DexOffers from "./DexOffers";
type Props = {
  onCloseModal: () => void;
  pool: string;
  tokenA: Currency;
  tokenB: Currency;
  amountA: number;
  amountB: string;
  swapType: SWAP_TYPE;
  offers: any;
  rate: string;
  swapSuccess: () => void;
  slippage: number;
  fetchBalanceFrom: () => void;
  fetchBalanceTo: () => void;
  signer?: any;
  fee: any;
  swapParams?: any;
};

function SwapModal({
  onCloseModal,
  pool,
  tokenA,
  tokenB,
  amountA,
  amountB,
  swapType,
  offers,
  rate,
  swapSuccess,
  slippage,
  fetchBalanceFrom,
  fetchBalanceTo,
  signer,
  fee,
  swapParams,
}: Props) {
  const { address: account, isConnected } = useAccount();
  const contractAddr = useContract();
  const [feeN, setFee] = useState<string>("0");

  const { data: allowance, refetch } = useContractRead({
    address: tokenA?.isToken ? tokenA.address : tokenA.wrapped.address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [account!, contractAddr!.contract],
    enabled: !!contractAddr && !!account && tokenA?.isToken,
  });


  const handleRefetchs = () => {
    refetch();
    fetchBalanceFrom();
    fetchBalanceTo();
  };

  const bigAmountA = useMemo(() => {
    return parseUnits(amountA?.toString(), tokenA?.decimals);
  }, [amountA, tokenA]);

  const bigAmountB = useMemo(() => {
    return parseUnits(amountB?.toString(), tokenB?.decimals);
  }, [amountB, tokenB]);



  return (
    <div
      className={
        "z-[9999] fixed w-full h-full bg-white flex items-center justify-center backdrop-blur-2xl bg-opacity-10 top-0 left-0"
      }
    >
      <div
        className={
          "z-[9999] p-6 lg:p-14 max-w-[95vw] min-w-[400px] md:min-w-[570px] bg-[rgba(26,29,36,0.80)]  backdrop-blur-[52px] rounded-[48px] border-opacity-10"
        }
      >
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl md:text-4xl mb-5 text-[#FFE7DD]">
            Review swap details
          </h1>

          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium text-[#FFE7DD] hover:bg-white/20 transition-all rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            <FontAwesomeIcon icon={faX} />
          </div>
        </div>
        <div className="flex justify-between mb-10 mt-5 items-center">
          <SwapToken value={amountA.toFixed(5)} currency={tokenA} />
          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-[#AAA]"
            width={80}
            height={80}
          />
          <SwapToken value={+amountB} currency={tokenB} />
        </div>

        <DexOffers offers={offers} tokenTo={tokenB} />

        <div className="w-full bg-[#AAA] h-[1px] my-6 mb-10"></div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xl text-[#FFE7DD]">Liquidity source</span>
          <span>
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                <img
                  src={swapTypeMapping[swapType]?.icon}
                  alt={swapTypeMapping[swapType]?.name}
                />
              </div>
              <p className="inline-block mt-1 text-[#FFE7DD]">
                <span className="text-4xl">{swapTypeMapping[swapType]?.name[0]}</span>
                {swapTypeMapping[swapType]?.name.slice(1)}
              </p>
            </div>
          </span>
        </div>

        <div className="my-10 text-base md:text-lg flex flex-col gap-2">
          {/**
             <div className="flex justify-between">
            <span>Gas Fee</span>
            <span>{fee} ETH</span className="text-right">
          </div>
           */}

          <div className="flex justify-between">
            <span className="text-[#FFE7DD]">Minimum Receive</span>
            <span className="text-right text-[#FFE7DD]">
              {" "}
              {(+amountB).toFixed(7) } {tokenB?.symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-right text-[#FFE7DD]">Slippage tolerance</span>
            <span className="text-[#FFE7DD]">{slippage}%</span>
          </div>
          {/** 
          <div className="flex justify-between">
            <span>Current Rate</span>
            <span className="text-right">
              1 ETH = {rate} {tokenB?.symbol}
            </span>
          </div>
          */}
        </div>
        {!tokenA.isNative && (!allowance || allowance < bigAmountA) ? (
          <AllowButton
            tokenIn={tokenA}
            amountIn={bigAmountA}
            onSuccess={handleRefetchs}
          />
        ) : (
          <SwapButton
            swapParams={swapParams}
            swapSuccess={() => swapSuccess()}
            tokenIn={tokenA}
            tokenOut={tokenB}
            signer={signer}
          />
        )}
      </div>
    </div>
  );
}

export default SwapModal;
