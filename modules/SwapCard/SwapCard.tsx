import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useBalance, useContractRead, useNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { formatUnits, parseUnits } from "viem";
import _, { get, set } from "lodash";

import Input from "@/components/Input";
import Button from "@/components/Button";
import TokenSelect from "@/components/TokenSelect";
import useNativeCurrency from "@/hooks/useNativeCurrency";
import Tokens from "@/constants/tokens";
import useContract from "@/hooks/useContract";
import { ChainId, Currency, SWAP_TYPE } from "@/types";
import SwapModal from "./SwapModal";
import { UNISWAP_DEFAULT_FEE } from "@/constants/contracts";

import SpaceFiPoolFactoryAbi from "@/constants/abis/spacefi.pool-factory.json";
import SpaceFiRouterAbi from "@/constants/abis/spacefi.router.json";
import { abi as UniswapPoolFactoryAbi } from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import { toFixedValue } from "@/utils/address";
import { ethers } from "ethers";
import SlippageButton from "./SlippageButton";
import axios from "axios";
import { networks } from "@/constants/networks";
import { FaWallet } from "react-icons/fa";
import Image from "next/image";

type Props = {};

const percentageButtons = [25, 50, 75, 100];

const SwapCard: React.FC<Props> = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const contractAddr = useContract();
  const [swapAmount, setSwapAmount] = useState("0");
  const [receiveAmount, setReceiveAmount] = useState("0");
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [dexType, setDexType] = useState<SWAP_TYPE>(SWAP_TYPE.UNISWAP);
  //TODO: Add tokens
  const [tokenFrom, setTokenFrom] = useState<Currency>();
  const [tokenTo, setTokenTo] = useState<Currency | undefined>(
    Tokens[ChainId.SCROLL_SEPOLIA].usdt
  );
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isChangeFrom, setChangeFrom] = useState(true);
  const [rate, setRate] = useState("0");
  const getCurrentRateTimeout = useRef<any>(null);
  const getTokenRateTimeout = useRef<any>(null);
  const [isLoadingSwapAmount, setIsLoadingSwapAmount] = useState(false);
  const [isLoadingReceiveAmount, setIsLoadingReceiveAmount] = useState(false);

  const { chain, chains } = useNetwork();

  const {
    data: balanceFrom,
    isLoading: isLoadingBalanceFrom,
    refetch: fetchBalanceFrom,
  } = useBalance({
    address: address,
    ...(!tokenFrom?.isNative && {
      token: tokenFrom?.wrapped.address,
    }),
    chainId: tokenFrom?.chainId,
    enabled: !!tokenFrom,
  });

  const {
    data: balanceTo,
    isLoading: isLoadingBalanceTo,
    refetch: fetchBalanceTo,
  } = useBalance({
    address: address,
    ...(!tokenTo?.isNative && {
      token: tokenTo?.wrapped.address,
    }),
    chainId: tokenTo?.chainId,
    enabled: !!tokenTo,
  });

  const { data: poolAddress } = useContractRead(
    dexType === SWAP_TYPE.SPACEFI
      ? {
          address: contractAddr?.spacefi.poolFactory,
          abi: SpaceFiPoolFactoryAbi,
          functionName: "getPair",
          args: [tokenFrom?.wrapped.address, tokenTo?.wrapped.address],
          enabled: !!contractAddr && !!tokenFrom && !!tokenTo,
        }
      : {
          address: contractAddr?.uniswap.poolFactory,
          abi: UniswapPoolFactoryAbi,
          functionName: "getPool",
          args: [
            tokenFrom?.wrapped.address,
            tokenTo?.wrapped.address,
            UNISWAP_DEFAULT_FEE,
          ],
          enabled: !!contractAddr && !!tokenFrom && !!tokenTo,
        }
  );

  useEffect(() => {
    fetchBalanceFrom();
    fetchBalanceTo();
  }, [
    chain,
    address,
    tokenFrom,
    tokenTo,
    isConnected,
    contractAddr,
    dexType,
    slippage,
    isChangeFrom,
    rate,
    swapAmount,
    receiveAmount,
    balanceFrom,
    balanceTo,
  ]);

  useEffect(() => {
    getCurrentRate();
  }, [tokenFrom]);

  const handleINChange = (e: any) => {
    if (
      (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") ||
      (tokenTo?.symbol == "ETH" && tokenFrom?.symbol == "WETH")
    ) {
      setSwapAmount(e.target.value);
      setReceiveAmount(e.target.value);
    } else {
      console.log(e.target.value);
      setSwapAmount(e.target.value);
    }
  };

  const handleOUTChange = (e: any) => {
    if (
      (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") ||
      (tokenTo?.symbol == "ETH" && tokenFrom?.symbol == "WETH")
    ) {
      setSwapAmount(e.target.value);
      setReceiveAmount(e.target.value);
    } else {
      setReceiveAmount(e.target.value);
    }
  };

  const getCurrentRate = () => {
    clearTimeout(getCurrentRateTimeout.current!);
    getCurrentRateTimeout.current = setTimeout(async () => {
      if (!tokenFrom || !tokenTo || !swapAmount || +swapAmount === 0) return;
      else {
        setIsLoadingReceiveAmount(true);

        const exchangeRate = await axios.post("/api/exchange", {
          amount: swapAmount.toString(),
          from: tokenFrom?.isNative ? tokenFrom.wrapped.address : tokenFrom?.address,
          to: tokenTo?.isNative ? tokenTo.wrapped.address : tokenTo?.address,
          type: "IN",
        });

        setDexType(
          exchangeRate?.data?.dex === "space-fi"
            ? SWAP_TYPE.SPACEFI
            : exchangeRate?.data?.dex === "uniswap"
            ? SWAP_TYPE.UNISWAP
            : SWAP_TYPE.IZUMI
        );
        setReceiveAmount(ethers.utils.formatUnits(exchangeRate?.data.amount, 18));
        setRate(ethers.utils.formatUnits(exchangeRate?.data.amount, 18));
        setIsLoadingReceiveAmount(false);
      }
    }, 200);
  };

  useEffect(() => {
    if (!isChangeFrom) return;
    if (
      (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") ||
      (tokenTo?.symbol == "ETH" && tokenFrom?.symbol == "WETH")
    )
      return;
    getCurrentRate();
  }, [swapAmount, tokenFrom, tokenTo]);

  useEffect(() => {
    if (isChangeFrom) return;
    getTokenRate();
  }, [receiveAmount, tokenFrom, tokenTo]);

  const getTokenRate = async () => {
    clearTimeout(getTokenRateTimeout.current!);
    getTokenRateTimeout.current = setTimeout(async () => {
      if (!tokenFrom || !tokenTo) return;
      else {
        setIsLoadingSwapAmount(true);
        const exchangeRate = await axios.post("/api/exchange", {
          amount: receiveAmount.toString(),
          from: tokenFrom?.isNative ? tokenFrom.wrapped.address : tokenFrom?.address,
          to: tokenTo?.isNative ? tokenTo.wrapped.address : tokenTo?.address,
          type: "OUT",
        });
        setDexType(
          exchangeRate?.data?.dex === "space-fi"
            ? SWAP_TYPE.SPACEFI
            : exchangeRate?.data?.dex === "uniswap"
            ? SWAP_TYPE.UNISWAP
            : SWAP_TYPE.IZUMI
        );
        setSwapAmount(ethers.utils.formatUnits(exchangeRate?.data.amount, 18));
        setIsLoadingSwapAmount(false);
      }
    }, 200);
  };

  const native = useNativeCurrency();

  useEffect(() => {
    setTokenFrom(native);
  }, [native]);

  const handleSwitchToken = () => {
    let tokenToA = tokenTo;
    setTokenTo(tokenFrom);
    setTokenFrom(tokenToA);
  };

  const handleClickInputPercent = (percent: number) => {
    if (!balanceFrom || !tokenFrom) return;
    const balance = formatUnits(balanceFrom.value, tokenFrom?.decimals);
    setSwapAmount(((parseFloat(balance) * percent) / 100).toString());
    setChangeFrom(true);
  };

  const onKeyDownSwapAmount = () => {
    setChangeFrom(true);
  };

  const onKeyDownReceiveAmount = () => {
    setChangeFrom(false);
  };

  return (
    <div className="w-full max-w-[600px] p-8 gap-2 flex flex-col relative mx-auto pt-3">
      <div className={`w-full h-full gap-4 flex-1 flex justify-between flex-col`}>
        <div className="relative w-full flex flex-col">
          <div className="w-full flex flex-col bg-[rgba(26,29,36,0.80)] mb-[2px] backdrop-blur-[52px] rounded-[48px] p-8">
            <div className="flex justify-between items-center space-x-2 mt-4">
              <span className="text-[#FFF0DD]">You Sell</span>
              {balanceFrom && (
                <div className="text-right text-lg">
                  {toFixedValue(balanceFrom.formatted, 4)} {balanceFrom.symbol}
                </div>
              )}
            </div>
            <div className="rounded-lg flex w-full flex-col gap-4 mb-4 ">
              <div className="flex justify-between gap-8 items-center">
                <TokenSelect
                  onChange={setTokenFrom}
                  className="flex-1"
                  token={tokenFrom}
                />
                <Input
                  onChange={(e) => handleINChange(e)}
                  onKeyDown={onKeyDownSwapAmount}
                  value={swapAmount}
                  type="number"
                  loading={isLoadingSwapAmount}
                  placeholder="Enter Amount"
                  className="w-full crosschainswap-input text-end" // Increase the height here
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {percentageButtons.map((val, index) => (
                  <Button
                    className="font-monteserrat text-sm"
                    key={"perc-button-" + index}
                    onClick={() => handleClickInputPercent(val)}
                  >
                    {val}%
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleSwitchToken}
            className="w-20 h-20 p-4 my-5 z-[2] absolute left-[43%] top-[40%] cursor-pointer mx-auto rounded-full text-white flex items-center justify-center bg-[#29303D] hover:bg-opacity-40 transition-all"
          >
            <Image
              src={"/change-icon.svg"}
              width={24}
              height={24}
              className="h-6 w-6"
              alt="change-icon"
            />
          </button>
          <div className="w-full flex flex-col bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[48px] p-8">
            <div className="flex justify-between items-center space-x-2 mt-4">
              <span className="text-[#FFF0DD]">You Buy</span>
              {balanceTo && (
                <div className="text-right text-lg">
                  {toFixedValue(balanceTo.formatted, 4)} {balanceTo.symbol}
                </div>
              )}
            </div>

            <div className="flex w-full gap-8 justify-between items-center">
              <TokenSelect onChange={setTokenTo} token={tokenTo} />
              <Input
                onChange={(e) => handleOUTChange(e)}
                onKeyDown={onKeyDownReceiveAmount}
                value={receiveAmount}
                type="number"
                loading={isLoadingReceiveAmount}
                placeholder="Receive Amount"
                className="crosschainswap-input w-full text-end"
              />
            </div>
            <Button
              variant="bordered"
              disabled={
                isConnected &&
                (!tokenFrom || !tokenTo || !swapAmount) &&
                chain?.id === 534351
              }
              className="w-full p-4 rounded-lg text-xl font-semibold mt-4"
              onClick={() => (isConnected ? setIsSwapModalOpen(true) : open())}
            >
              {isConnected ? "SWAP" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
      {tokenFrom && tokenTo && isSwapModalOpen && chain?.id === 534351 ? (
        <SwapModal
          pool={poolAddress as string}
          tokenA={tokenFrom}
          tokenB={tokenTo}
          amountA={+swapAmount}
          amountB={receiveAmount}
          swapType={dexType}
          swapSuccess={() => {
            setSwapAmount("0");
            setReceiveAmount("0");
            setIsSwapModalOpen(false);
            fetchBalanceFrom();
            fetchBalanceTo();
          }}
          rate={Number(rate).toFixed(4)}
          onCloseModal={() => setIsSwapModalOpen(false)}
          slippage={slippage}
          fetchBalanceFrom={fetchBalanceFrom}
          fetchBalanceTo={fetchBalanceTo}
        />
      ) : null}
    </div>
  );
};

export default SwapCard;
