import React, { use, useEffect, useMemo, useState } from "react";
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
import { fetchFeeData } from "@wagmi/core";
type Props = {
  onCloseModal: () => void;
  pool: string;
  tokenA: Currency;
  tokenB: Currency;
  amountA: number;
  amountB: string;
  swapType: SWAP_TYPE;
  rate: string;
  swapSuccess: () => void;
};

function SwapModal({
  onCloseModal,
  pool,
  tokenA,
  tokenB,
  amountA,
  amountB,
  swapType,
  rate,
  swapSuccess,
}: Props) {
  const { address: account, isConnected } = useAccount();
  const contractAddr = useContract();
  const [fee, setFee] = useState<string>("0");
  const { data: allowance, refetch } = useContractRead({
    address: tokenA.wrapped.address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [account!, contractAddr!.contract],
    enabled: !!contractAddr && !!account && tokenA?.isToken,
  });

  const bigAmountA = useMemo(() => {
    return parseUnits(amountA?.toString(), tokenA?.decimals);
  }, [amountA, tokenA]);

  const bigAmountB = useMemo(() => {
    return parseUnits(amountB?.toString(), tokenB?.decimals);
  }, [amountB, tokenB]);

  useEffect(() => {
    if (isConnected) {
      getFee();
    }
  }, [isConnected, account]);

  const getFee = async () => {
    const feeData = await fetchFeeData({
      chainId: networks[0].chainId,
      formatUnits: "ether",
    });
    if (feeData) setFee(feeData?.formatted?.gasPrice ?? "0");

    console.log("feeData", feeData);
  };

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
        <div className="flex justify-between mb-8">
          <h1 className={"text-sm md:text-lg "}>Review swap details</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium hover:bg-white/20 transition-all rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            <FontAwesomeIcon icon={faX} />
          </div>
        </div>
        <div className="flex justify-between mb-10 mt-5 items-center">
          <SwapToken value={amountA} currency={tokenA} />
          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-[#AAA]"
            width={30}
            height={30}
          />
          <SwapToken value={+amountB} currency={tokenB} />
        </div>
        <div className="w-full bg-[#AAA] h-[1px] my-6 mb-10"></div>

        <div className="flex justify-between items-center mt-4">
          <span>Liquidity source</span>

          <span>
            {swapType === SWAP_TYPE.UNISWAP ? (
              <div className="flex items-center">
                <img
                  src="https://avatars.githubusercontent.com/u/36115574?s=200&v=4"
                  className="w-8 h-8 inline-block mr-2 rounded-full" // Add margin-right for spacing
                  alt="Uniswap"
                />
                <p className="inline-block mt-1">Uniswap</p>
              </div>
            ) : swapType === SWAP_TYPE.SPACEFI ? (
              <div className="flex items-center">
                <img
                  src=" https://raw.githubusercontent.com/SpaceFinance/default-token-list/master/assets/0x4E2D4F33d759976381D9DeE04B197bF52F6bC1FC.png"
                  className="w-8 h-8 inline-block mr-2 rounded-full" // Add margin-right for spacing
                  alt="Uniswap"
                />
                <p className="inline-block">SpaceFi</p>
              </div>
            ) : (
              ""
            )}
          </span>
        </div>

        <div className="my-10 text-xs md:text-sm flex flex-col gap-3">
          {/**
             <div className="flex justify-between">
            <span>Gas Fee</span>
            <span>{fee} ETH</span>
          </div>
           */}

          <div className="flex justify-between">
            <span>Minimum Receive</span>
            <span>
              {" "}
              {(+amountB - (+amountB * 1) / 100).toFixed(4)} {tokenB?.symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Slippage tolerance</span>
            <span>1%</span>
          </div>
          <div className="flex justify-between">
            <span>Rate</span>
            <span>
              1 ETH = {rate} {tokenB?.symbol}
            </span>
          </div>
        </div>
        {!tokenA.isNative && (!allowance || allowance < bigAmountA) ? (
          <AllowButton tokenIn={tokenA} amountIn={bigAmountA} onSuccess={refetch} />
        ) : (
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
            swapSuccess={() => swapSuccess()}
            tokenIn={tokenA}
            tokenOut={tokenB}
          />
        )}
      </div>
    </div>
  );
}

export default SwapModal;
