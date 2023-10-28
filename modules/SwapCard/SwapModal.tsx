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
import { useNetwork } from "wagmi";
import { generatePath } from "@/utils/path";
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
  slippage: number;
  fetchBalanceFrom: () => void;
  fetchBalanceTo: () => void;
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
  slippage,
  fetchBalanceFrom,
  fetchBalanceTo,
}: Props) {
  const { address: account, isConnected } = useAccount();
  const contractAddr = useContract();
  const [fee, setFee] = useState<string>("0");

  const { data: allowance, refetch } = useContractRead({
    address: (tokenA?.isToken ? tokenA.address  : tokenA.wrapped.address),
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
  };

  return (
    <div
      className={
        "z-[9999] fixed w-full h-full bg-white flex items-center justify-center backdrop-blur-2xl bg-opacity-10 top-0 left-0"
      }
    >
      <div
        className={
          "z-[9999] p-14 max-w-[95vw] min-w-[400px] md:min-w-[570px] bg-[rgba(26,29,36,0.80)]  backdrop-blur-[52px] rounded-[48px] border-opacity-10"
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
        <div className="w-full bg-[#AAA] h-[1px] my-6 mb-10"></div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xl text-[#FFE7DD]">Liquidity source</span>

          <span>
            {swapType === SWAP_TYPE.SKYDROME ? (
              <div className="flex items-center">
                <img
                  src="https://skydrome.finance/assets/Logos/PNG/Logo.png"
                  className="w-8 h-8 inline-block mr-2 rounded-full" // Add margin-right for spacing
                  alt="Skydrome"
                />
                <p className="inline-block mt-1 text-[#FFE7DD]">Skydrome</p>
              </div>
            ) : swapType === SWAP_TYPE.SPACEFI ? (
              <div className="flex items-center">
                <img
                  src=" https://raw.githubusercontent.com/SpaceFinance/default-token-list/master/assets/0x4E2D4F33d759976381D9DeE04B197bF52F6bC1FC.png"
                  className="w-8 h-8 inline-block mr-2 rounded-full" // Add margin-right for spacing
                  alt="Spacefi"
                />
                <p className="inline-block text-[#FFE7DD]">SpaceFi</p>
              </div>
            ) : swapType === SWAP_TYPE.IZUMI ? (
              <div className="flex items-center">
                <img
                  src="https://izumi.finance/assets/home/iziLogo/logo.svg"
                  className="w-8 h-8 inline-block mr-2 rounded-full" // Add margin-right for spacing
                  alt="Izumi"
                />
                <p className="inline-block text-[#FFE7DD]">Izumi</p>
              </div>
            ) : swapType === SWAP_TYPE.KYBERSWAP ? (
              <div className="flex items-center">
                <img
                  src="https://storage.googleapis.com/ks-setting-1d682dca/70129bd5-c3eb-44e8-b9fc-e6d76bf80b921697557071098.png"
                  className="w-8 h-8 inline-block mr-2 rounded-full" // Add margin-right for spacing
                  alt="Kyberswap"
                />
                <p className="inline-block text-[#FFE7DD]">KyberSwap</p>
              </div>
            ) : swapType === SWAP_TYPE.PUNKSWAP ? (
              <div className="flex items-center">
                <img
                  src="https://storage.googleapis.com/ks-setting-1d682dca/bcc2ed81-3d91-4b71-a615-ed4102cf8fb41697557738542.png"
                  className="w-8 h-8 inline-block mr-2 rounded-full" // Add margin-right for spacing
                  alt="PunkSwap"
                />
                <p className="inline-block text-[#FFE7DD]">PunkSwap</p>
              </div>
            ) : swapType === SWAP_TYPE.PAPYRUSSWAP ? (
              <div className="flex items-center">
                <img
                  src="https://papyrusswap.com/static/media/papyrus-logo.a7f47ae8.png"
                  className="w-10 h-10 inline-block mr-2 rounded-full" // Add margin-right for spacing
                  alt="PAPYRUSSWAP"
                />
                <p className="inline-block text-[#FFE7DD]">PapyrusSwap</p>
              </div>
            )
             : swapType === SWAP_TYPE.COFFEESWAP ? (
                <div className="flex items-center">
                  <img
                    src="https://www.coffeefi.xyz/logo/logo.png"
                    className="w-8 h-8 inline-block mr-2 rounded-full" // Add margin-right for spacing
                    alt="COFFEESWAP"
                  />
                  <p className="inline-block text-[#FFE7DD]">CoffeeSwap</p>
                </div>
             )
            : (
              <div className="flex items-center">
                <img
                  src="https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F3580858907-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fa1srPi3SG0RLa68aU4tX%252Ficon%252Fr9gnUAaUG96bxSLZ02SC%252Flogo-192.png%3Falt%3Dmedia%26token%3Db68cb07a-5d86-40c7-88e0-1a9fcc52ede6"
                  className="w-10 h-10 inline-block mr-2 rounded-full" // Add margin-right for spacing
                  alt="Syncswap"
                />
                <p className="inline-block text-[#FFE7DD]">Syncswap</p>
              </div>
            )}
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
              {((+amountB - (+amountB * slippage) / 100) - (+amountB * 30 / 10000))?.toFixed(7) } {tokenB?.symbol}
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
            swapParam={{
              poolAddress: pool,
              tokenIn: tokenA?.isToken ?  tokenA?.address : tokenA.wrapped.address,
              tokenOut: tokenB?.isToken ?  tokenB?.address : tokenB.wrapped.address,
              amountIn: bigAmountA,
              amountOutMin: tokenA?.symbol === "Script" || tokenB?.symbol === "Script" ? 0 :bigAmountB,
              swapType: swapType,
              path:
                generatePath(
                  tokenA?.isToken ?  tokenA?.address : tokenA?.wrapped.address,
                  tokenB?.isToken ?  tokenB?.address : tokenB?.wrapped.address,
                  300
                ).toString() || "0x0000000000000000000000000000000000000000",
              fee: 300 || UNISWAP_DEFAULT_FEE || 0,
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
