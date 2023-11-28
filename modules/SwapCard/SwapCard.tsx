import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useBalance, useContractRead, useNetwork } from "wagmi";
import { readContract } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import { formatUnits } from "viem";
import _, { set } from "lodash";
import Input from "@/components/Input";
import Button from "@/components/Button";
import TokenSelect from "@/components/TokenSelect";
import useNativeCurrency from "@/hooks/useNativeCurrency";
import Tokens from "@/constants/tokens";
import useContract from "@/hooks/useContract";
import { ChainId, Currency, SWAP_TYPE } from "@/types";
import SwapModal from "./SwapModal";
import SpaceFiPoolFactoryAbi from "@/constants/abis/spacefi.pool-factory.json";
import { toFixedValue } from "@/utils/address";
import { ethers } from "ethers";
import axios from "axios";
import Image from "next/image";
import SkydromePoolFactory from "@/constants/abis/skydrome.pool-factory.json";
import IziSwapPoolFactory from "@/constants/abis/iziSwapFactory.json";
import SnycSwapPoolFactory from "@/constants/abis/syncswapPoolFactory.json";
import PunkSwapPoolFactory from "@/constants/abis/punkSwapPoolFactory.json";
import KyberSwapFactory from "@/constants/abis/kyberSwapFactory.json";
import IPyth from "@/constants/abis/IPyth.json";
import { type WalletClient, useWalletClient } from "wagmi";
import { providers } from "ethers";
import { useGlobalContext } from "@/contexts";
import SlippageButton from "./SlippageButton";
import { toast } from "react-toastify";
import { useRealTimeETHPrice } from "@/hooks/useRealTimeETHPrice";
import TokenModal from "@/components/TokenModal";
import RouteModal from "@/components/RouteModal";
import RefreshButton from "./RefreshButton";
import { useFeeData } from "wagmi";
import { swapTypeMapping, SwapParams, Route } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import RightArrowIcon from "@/assets/images/right-arrow.svg";

type Props = {};

const percentageButtons = [25, 50, 75, 100];

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: 534352,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}

const SwapCard: React.FC<Props> = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const contractAddr = useContract();
  const [swapAmount, setSwapAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [dexType, setDexType] = useState<SWAP_TYPE>(SWAP_TYPE.SKYDROME);
  //TODO: Add tokens
  const [tokenFrom, setTokenFrom] = useState<Currency>();
  const [tokenTo, setTokenTo] = useState<Currency | undefined>(
    Tokens[ChainId.SCROLL_MAINNET]?.usdc
  );
  const { slippage } = useGlobalContext();
  const [percentage, setPercentage] = useState<number>(0.5);
  const [isChangeFrom, setChangeFrom] = useState(true);
  const [rate, setRate] = useState("0");
  const getCurrentRateTimeout = useRef<any>(null);
  const getTokenRateTimeout = useRef<any>(null);
  const [isLoadingSwapAmount, setIsLoadingSwapAmount] = useState(false);
  const [isLoadingReceiveAmount, setIsLoadingReceiveAmount] = useState(false);
  const [pairAddress, setPairAddress] = useState<string>();
  const { chain, chains } = useNetwork();
  const signer = useEthersSigner({ chainId: 534352 });
  const ethPrice = useRealTimeETHPrice();
  const [ethUSD, setEthPrice] = useState<number>(0);
  const [fee, setFee] = useState<string>("0");
  const [minimumReceived, setMinimumReceived] = useState<string>("0");
  const [estGasFee, setEstGasFee] = useState<string>("0");
  const [priceImpact, setPriceImpact] = useState<string>("0");
  const [swapParams, setSwapParams] = useState<SwapParams[]>([]);
  const [routes, setRoutes] = useState<Route[]>([
    {
      tokenIn: "",
      tokenOut: "",
      amountIn: "",
      childIndex: 0,
      amountOut: BigInt(0),
      minAmountOut: BigInt(0),
      tokenOutLiquidity: BigInt(0),
      routePercentage: 0,
      fee: 0,
    },
    {
      tokenIn: "",
      tokenOut: "",
      amountIn: "",
      childIndex: 0,
      amountOut: BigInt(0),
      minAmountOut: BigInt(0),
      tokenOutLiquidity: BigInt(0),
      routePercentage: 0,
      fee: 0,
    },
    {
      tokenIn: "",
      tokenOut: "",
      amountIn: "",
      childIndex: 0,
      amountOut: BigInt(0),
      minAmountOut: BigInt(0),
      tokenOutLiquidity: BigInt(0),
      routePercentage: 0,
      fee: 0,
    },
    {
      tokenIn: "",
      tokenOut: "",
      amountIn: "",
      childIndex: 0,
      amountOut: BigInt(0),
      minAmountOut: BigInt(0),
      tokenOutLiquidity: BigInt(0),
      routePercentage: 0,
      fee: 0,
    }
  ]);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const { refresh, setRefresh } = useGlobalContext();
  // const [offers, setOffers] = useState<DexOffer[]>([]);

  const {
    data: balanceFrom,
    isLoading: isLoadingBalanceFrom,
    refetch: fetchBalanceFrom,
  } = useBalance({
    address: address,
    ...(!tokenFrom?.isNative && {
      token: tokenFrom?.wrapped?.address || tokenFrom?.address,
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
      token: tokenTo?.wrapped?.address || tokenTo?.address,
    }),
    chainId: tokenTo?.chainId,
    enabled: !!tokenTo,
  });

  // // Instantiate the contract
  // const contract = new ethers.Contract(
  //   contractAddr?.skydrome?.poolFactory || "0x5300000000000000000000000000000000000004",
  //   SkydromePoolFactory,
  //   signer
  // );

  // // Send a call to the getPair function using ethers.js
  // async function getPair() {
  //   try {
  //     const pair = await contract.functions.getPair(
  //       tokenFrom?.isToken ? tokenFrom?.address : tokenFrom?.wrapped?.address,
  //       tokenTo?.isToken ? tokenTo?.address : tokenTo?.wrapped?.address,
  //       false
  //     );
  //     return pair;
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }
  // const contractIzumi = new ethers.Contract(
  //   contractAddr?.iziswap?.liquidityManager ||
  //     "0x5300000000000000000000000000000000000004",
  //   IziSwapPoolFactory,
  //   signer
  // );
  // async function getPool() {
  //   try {
  //     const pair = await contractIzumi.pool(
  //       tokenFrom?.isToken ? tokenFrom?.address : tokenFrom?.wrapped?.address,
  //       tokenTo?.isToken ? tokenTo?.address : tokenTo?.wrapped?.address,
  //       3000
  //     );
  //     return pair;
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  // const getEthPrice = async () => {
  //   if (!ethPrice) {
  //     const res = await axios.get(
  //       "https://api.binance.com/api/v3/avgPrice?symbol=ETHUSDT"
  //     );
  //     setEthPrice(res.data.price);
  //   } else {
  //     setEthPrice(ethPrice);
  //   }
  // };

  // useEffect(() => {
  //   //getEthPrice();
  // }, [tokenFrom, tokenTo, swapAmount, receiveAmount, dexType, pairAddress]);

  // const { data: poolAddress, refetch } = useContractRead(
    
  // );

  // useEffect(() => {
  //   fetchBalanceFrom();
  //   fetchBalanceTo();
  //   refetch();
  // }, [
  //   chain,
  //   address,
  //   tokenFrom,
  //   tokenTo,
  //   isConnected,
  //   contractAddr,
  //   dexType,
  //   slippage,
  //   isChangeFrom,
  //   rate,
  //   swapAmount,
  //   receiveAmount,
  //   balanceFrom,
  //   balanceTo,
  //   showFrom,
  //   showTo,
  // ]);

  // useEffect(() => {
  //   if (
  //     (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") ||
  //     (tokenTo?.symbol == "ETH" && tokenFrom?.symbol == "WETH")
  //   ) {
  //     setReceiveAmount(swapAmount);
  //   } else {
  //     getCurrentRate();
  //   }
  // }, [tokenFrom, tokenTo, refresh]);

  // const handleINChange = async (e: any) => {
  //   // refetch();
  //   if (
  //     (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") ||
  //     (tokenTo?.symbol == "ETH" && tokenFrom?.symbol == "WETH")
  //   ) {
  //     setSwapAmount(e.target.value);
  //     setReceiveAmount(e.target.value);
  //   } else {
  //     console.log(e.target.value);
  //     setSwapAmount(e.target.value);
  //   }
  // };

  // const getCurrentRate = async () => {
  //   clearTimeout(getCurrentRateTimeout.current!);
  //   getCurrentRateTimeout.current = setTimeout(async () => {
  //     if (!tokenFrom || !tokenTo || !swapAmount || +swapAmount === 0) return;
  //     else {
  //       setIsLoadingReceiveAmount(true);

  //       const exchangeRate = await axios.post("/api/exchange", {
  //         amount: swapAmount.toString(),
  //         from: tokenFrom?.isNative ? tokenFrom.wrapped.address : tokenFrom?.address,
  //         fromDecimals: tokenFrom?.wrapped?.decimals || tokenFrom?.decimals,
  //         to: tokenTo?.isNative ? tokenTo?.wrapped?.address : tokenTo?.address,
  //         toDecimals: tokenTo?.wrapped?.decimals || tokenTo?.decimals,
  //         type: "IN",
  //       });

  //       // setOffers(exchangeRate.data);
  //       console.log("exchangeRate", exchangeRate);

  //       switch (exchangeRate?.data[0]?.dex) {
  //         case "space-fi":
  //           setDexType(SWAP_TYPE.SPACEFI);
  //           break;
  //         case "skydrome":
  //           setDexType(SWAP_TYPE.SKYDROME);
  //           break;
  //         case "iziswap":
  //           setDexType(SWAP_TYPE.IZUMI);
  //           break;
  //         case "syncswap":
  //           setDexType(SWAP_TYPE.SYNCSWAP);
  //           break;
  //         case "punkswap":
  //           setDexType(SWAP_TYPE.PUNKSWAP);
  //           break;
  //         case "kyberswap":
  //           setDexType(SWAP_TYPE.KYBERSWAP);
  //           break;
  //         case "coffeswap":
  //           setDexType(SWAP_TYPE.COFFEESWAP);
  //           break;
  //         case "papyrusswap":
  //           setDexType(SWAP_TYPE.PAPYRUSSWAP);
  //           break;
  //         case "sushiswap":
  //           setDexType(SWAP_TYPE.SUSHISWAP);
  //           break;
  //         default:
  //           setDexType(SWAP_TYPE.INVALID);
  //       }
  //       setReceiveAmount(
  //         ethers.utils
  //           .formatUnits(
  //             exchangeRate?.data[0]?.amount,
  //             tokenTo?.isToken ? tokenTo?.decimals : tokenTo.wrapped.decimals
  //           )
  //           .toString()
  //       );
  //       setRate(
  //         ethers.utils.formatUnits(
  //           exchangeRate?.data[0]?.amount,
  //           tokenTo?.isToken ? tokenTo?.decimals : tokenTo.wrapped.decimals
  //         )
  //       );
  //       setIsLoadingReceiveAmount(false);

  //       if (exchangeRate?.data[0]?.dex === "skydrome") {
  //         const pool = await getPair();

  //         if (pool) setPairAddress(pool[0]);
  //       } else if (exchangeRate?.data[0]?.dex === "iziswap") {
  //         const pool = await getPool();

  //         if (pool) setPairAddress(pool?.toString());
  //       } else if (exchangeRate?.data[0]?.dex === "syncswap") {
  //         console.log("poolAddress", tokenFrom, tokenTo);
  //         if (
  //           (tokenFrom.isToken
  //             ? tokenFrom?.address
  //             : tokenFrom?.wrapped?.address ===
  //                 "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df" && tokenTo.isToken
  //             ? tokenTo?.address
  //             : tokenTo?.wrapped?.address ===
  //               "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4") ||
  //           (tokenFrom.isToken
  //             ? tokenFrom?.address
  //             : tokenFrom?.wrapped?.address ===
  //                 "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4" && tokenTo.isToken
  //             ? tokenTo?.address
  //             : tokenTo?.wrapped?.address ===
  //               "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df")
  //         ) {
  //           setPairAddress("0x2076d4632853FB165Cf7c7e7faD592DaC70f4fe1");
  //         }
  //       } else {
  //         if (poolAddress) setPairAddress(poolAddress?.toString());
  //       }
  //     }
  //   }, 200);
  // };

  // useEffect(() => {
  //   if (!isChangeFrom) return;
  //   if (
  //     (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") ||
  //     (tokenTo?.symbol == "ETH" && tokenFrom?.symbol == "WETH")
  //   )
  //     return;
  //   getCurrentRate();
  // }, [swapAmount, tokenFrom, tokenTo]);

  // useEffect(() => {
  //   if (isChangeFrom) return;
  //   getTokenRate();
  // }, [receiveAmount, tokenFrom, tokenTo]);

  // const getTokenRate = async () => {
  //   clearTimeout(getTokenRateTimeout.current!);
  //   getTokenRateTimeout.current = setTimeout(async () => {
  //     if (!tokenFrom || !tokenTo) return;
  //     else {
  //       setIsLoadingSwapAmount(true);
  //       const exchangeRate = await axios.post("/api/exchange", {
  //         amount: receiveAmount.toString(),
  //         from: tokenFrom?.isNative ? tokenFrom.wrapped.address : tokenFrom?.address,
  //         to: tokenTo?.isNative ? tokenTo.wrapped.address : tokenTo?.address,
  //         type: "OUT",
  //       });
  //       setDexType(
  //         exchangeRate?.data?.dex === "space-fi"
  //           ? SWAP_TYPE.SPACEFI
  //           : exchangeRate?.data?.dex === "skydrome"
  //           ? SWAP_TYPE.SKYDROME
  //           : exchangeRate?.data?.dex === "iziswap"
  //           ? SWAP_TYPE.IZUMI
  //           : exchangeRate?.data?.dex === "syncswap"
  //           ? SWAP_TYPE.SYNCSWAP
  //           : exchangeRate?.data?.dex === "punkswap"
  //           ? SWAP_TYPE.PUNKSWAP
  //           : exchangeRate?.data?.dex === "kyberswap"
  //           ? SWAP_TYPE.KYBERSWAP
  //           : exchangeRate?.data?.dex === "coffeswap"
  //           ? SWAP_TYPE.COFFEESWAP
  //           : exchangeRate?.data?.dex === "papyrusswap"
  //           ? SWAP_TYPE.PAPYRUSSWAP
  //           : exchangeRate?.data?.dex === "sushiswap"
  //           ? SWAP_TYPE.SUSHISWAP
  //           : SWAP_TYPE.INVALID
  //       );
  //       setSwapAmount(
  //         ethers.utils.formatUnits(exchangeRate?.data.amount, tokenFrom.wrapped.decimals)
  //       );
  //       setIsLoadingSwapAmount(false);
  //     }
  //   }, 200);
  // };

  const native = useNativeCurrency();

  useEffect(() => {
    setTokenFrom(native);
  }, [native]);

  const handleSwitchToken = () => {
    let tokenToA = tokenTo;
    setTokenTo(tokenFrom);
    setTokenFrom(tokenToA);
    // fetch
  };

  const handleClickInputPercent = (percent: number) => {
    if(percent == percentage) {
      setPercentage(0);
      setChangeFrom(false);
      return;
    }

    if (
      (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") ||
      (tokenTo?.symbol == "ETH" && tokenFrom?.symbol == "WETH")
    ) {
      if (!balanceFrom || !tokenFrom) return;
      const balance = formatUnits(balanceFrom.value, tokenFrom?.decimals);
      setPercentage(percent);
      setSwapAmount(((parseFloat(balance) * percent) / 100).toString());
      setReceiveAmount(((parseFloat(balance) * percent) / 100).toString());
      setChangeFrom(true);
    } else {
      if (!balanceFrom || !tokenFrom) return;
      const balance = formatUnits(balanceFrom.value, tokenFrom?.decimals);
      setPercentage(percent);
      setSwapAmount(((parseFloat(balance) * percent) / 100).toString());
      setChangeFrom(true);
    }
  };

  // const onKeyDownSwapAmount = () => {
  //   setChangeFrom(true);
  // };

  // const onKeyDownReceiveAmount = () => {
  //   setChangeFrom(false);
  // };

  // function calculatePercentageDifference(value1: number, value2: number): number {
  //   const difference = value2 - value1;
  //   const percentageDifference = (difference / value1) * 100;
  //   return percentageDifference;
  // }

  // function getPercentageDifference(value1: number, value2: number): number {
  //   const percentageDiff = calculatePercentageDifference(value1, value2);
  //   if (percentageDiff) return percentageDiff;
  //   else return 0;
  // }

  const tokens: Currency[] = useMemo(() => {
    if (chain && Tokens[chain.id]) {
      const tokens = _.values(Tokens[chain.id]);
      return [native, ...tokens];
    } else {
      const tokens = _.values(Tokens[534352]);
      return [native, ...tokens];
    }
    return [];
    console.log(tokens);
  }, [chain, native]);

  return (
    <div className="xl:w-[520px] lg:w-[480px] md:w-[400px] sm:w-[360px] w-full xs:max-w-full max-w-[320px] lg:px-6 xs:px-2 px-2 py-2 gap-2 flex flex-col relative mx-auto">
      <div className={`w-full h-full gap-4 flex-1 flex justify-between flex-col`}>
        <div className="relative w-full flex flex-col mb-2">
          <div className="w-full z-[1] flex flex-col bg-[rgba(26,29,36,0.80)] mb-1 backdrop-blur-[52px] xs:rounded-[48px] rounded-[32px] lg:px-8 md:px-6 xs:px-4 px-2 xs:py-4 py-2 !pb-12">
            <div className="flex justify-between items-center mt-4 sm:px-4 px-6">
              <span className="text-white xl:text-xl lg:text-lg md:text-md xs:text-base text-sm">From</span>
              {balanceFrom && (
                <div className="text-right xl:text-xl lg:text-lg md:text-md xs:text-base text-sm text-[#FFF]">
                  {toFixedValue(balanceFrom.formatted, 4)} {balanceFrom.symbol}
                </div>
              )}
            </div>
            <div className="rounded-lg flex justify-center items-center relative w-full flex-col xs:gap-4 gap-2">
              <div className="flex flex-col w-full lg:mt-6 md:mt-5 sm:mt-4 mt-3 sm:mb-2 xs:mb-0 mb-2">
                <div
                  className="flex flex-row justify-between items-center relative sm:gap-8 xs:gap-6 gap-4 w-full"
                  style={{ position: "relative", zIndex: 4 }}
                >
                  <div className="flex justify-center items-center w-full">
                    <TokenSelect onClick={() => setShowFrom(true)} token={tokenFrom} />
                  </div>
                  <Input
                    onChange={(e) => {
                      // setPercentage(0);
                      // setChangeFrom(false);
                      // let val = parseInt(e.target.value, 10);
                      // if (isNaN(val)) {
                      //   setSwapAmount("");
                      // } else {
                      //   // is A Number
                      //   val = val >= 0 ? val : 0;
                      //   // handleINChange(e);
                      // }
                    }}
                    onKeyDown={() => {}}
                    // onKeyDown={onKeyDownSwapAmount}
                    value={swapAmount}
                    type="number"
                    placeholder="Enter Amount"
                    className="xs:!w-full !w-[75%] crosschainswap-input text-end xs:mr-0 mr-2" // Increase the height here
                  />
                </div>
              </div>
              <div className="flex flex-row flex-wrap justify-center items-center xl:gap-6 gap-2"> 
                {percentageButtons.map((val, index) => (
                  <div
                    className={`${
                      percentage === val ? "scale-[1.15] bg-white bg-opacity-5" : "scale-100"
                    } ${ balanceFrom && balanceTo && Number(toFixedValue(balanceFrom!.formatted, 4)) > 0 ? "" : "pointer-events-none opacity-50" } group cursor-pointer bg-black select-none xl:px-2 xl:py-2 px-1 py-2 lg:w-[5rem] sm:w-[4.5rem] w-[3.25rem] rounded-full bg-opacity-[0.15] flex flex-col text-center sm:text-sm text-xs transition-all duration-150 hover:cursor-pointer hover:bg-white hover:bg-opacity-5`}
                    key={"perc-button-" + index}
                    onClick={() => handleClickInputPercent(val)}
                  >
                    <span
                      className={`-mb-1 group-hover:text-white ${
                        percentage === val ? "text-[#EBC28E]" : "text-[white]/60"
                      } transition-all`}
                    >
                      {val}%
                    </span>
                  </div>
                ))}
              </div>
              <AnimatePresence>
                <motion.button
                  whileHover={{ rotate: 135, scale: 1.125, transition: { duration: 0.15 }}}
                  whileTap={{ rotate: 360, scale: 0.925, transition: { duration: 0.15 }}}
                  onClick={handleSwitchToken}
                  className="absolute self-center select-none bottom-0 md:-mb-20 xs:-mb-[4.75rem] -mb-[4.75rem] md:w-16 md:h-16 xs:w-14 xs:h-14 w-12 h-12 cursor-pointer mx-auto rounded-full text-white flex items-center justify-center bg-[#1e252e] hover:bg-[#252d38]"
                >
                  <Image
                    src={"/change-icon.svg"}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                    alt="change-icon"
                  />
                </motion.button>
              </AnimatePresence>
            </div>
          </div>
          <div className="w-full flex flex-col bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] xs:rounded-[48px] rounded-[32px] lg:px-8 md:px-6 xs:px-4 px-2 xs:py-4 py-2 xs:pb-12 !pb-6">
            <div className="flex justify-between items-center mt-4 sm:px-4 px-6">
              <span className="text-white xl:text-xl lg:text-lg md:text-md xs:text-base text-sm">To</span>
              {balanceTo && (
                <div className="text-white text-right xl:text-xl lg:text-lg md:text-md xs:text-base text-sm">
                  {toFixedValue(balanceTo.formatted, 4)} {balanceTo.symbol}
                </div>
              )}
            </div>
            <div className="flex flex-col w-full lg:mt-6 md:mt-5 sm:mt-4 mt-3 sm:mb-2 xs:mb-0 mb-2">
              <div className="flex flex-row justify-between items-center relative sm:gap-8 xs:gap-6 gap-4 w-full">
                <div className="flex justify-center items-center w-full">
                  <TokenSelect onClick={() => setShowTo(true)} token={tokenTo} />
                </div>                
                <Input
                  value={receiveAmount}
                  type="number"
                  loading={isLoadingReceiveAmount}
                  placeholder="Receive Amount"
                  className="xs:!w-full !w-[75%] crosschainswap-input text-end xs:mr-0 mr-2" // Increase the height here
                  disabled={true}
                />
              </div>
              <div
                className={`flex flex-col justify-between xs:p-5 p-3 md:mx-0 xs:mx-1 mx-2 bg-[#121419] bg-opacity-30 rounded-xl md:mt-6 mt-4 gap-1 ${''}`}
              >
                <div className="flex flex-row flex-wrap justify-between items-center w-full">
                  <span className="text-white xs:text-base text-sm">Minimum Received:</span>
                  <span className="text-white xs:text-base text-sm">{Number(minimumReceived) > 0 ?(minimumReceived + " " + tokenTo?.symbol) : "- " + tokenTo?.symbol}</span>
                </div>
                <div className="flex flex-row flex-wrap justify-between items-center w-full">
                  <span className="text-white xs:text-base text-sm">Slippage Tolerance:</span>
                  <span className="text-white xs:text-base text-sm">{slippage + "%"}</span>
                </div>
                <div className="flex flex-row flex-wrap justify-between items-center w-full">
                  <span className="text-white xs:text-base text-sm">Est. Gas Fee:</span>
                  <span className="text-white xs:text-base text-sm">{Number(estGasFee) > 0 ?(estGasFee + " ETH") : "- ETH"}</span>
                </div>
                <div className="flex flex-row flex-wrap justify-between items-center w-full">
                  <span className="text-white xs:text-base text-sm">Price Impact:</span>
                  <span className={"xs:text-base text-sm " + (Number(priceImpact) > 0 ? "text-green-500" : (Number(priceImpact) < 0 ? "text-red-500" : "text-white")) }>{Number(priceImpact) > 0 ?(priceImpact + "%") : "- %"}</span>
                </div>
              </div>
              <div
                className={`flex flex-col justify-between md:p-5 sm:p-4 p-3 bg-[#121419] bg-opacity-30 rounded-xl xs:mx-0 mx-2 mt-4 xs:mb-4 mb-2 ${
                  isLoadingReceiveAmount && "animate-pulse items-center"
                }`}
              >
                {/* {Number(swapAmount) == 0 || swapAmount == undefined ? ( */}
                {false ? (
                  <span className="text-white self-center text-center xs:text-base text-sm">
                    Enter your desired swap amount
                  </span>
                ):(
                  isLoadingReceiveAmount ? (
                    <span className="text-[#EBC28E] animate-pulse self-center xs:text-base text-sm">
                      Finding best route...
                    </span>
                  ) : (
                    <>
                      <div className="flex flex-row md:justify-evenly items-center w-full gap-4 md:overflow-x-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        {routes.map((route, index) => (
                          <div key={"route-" + index} className="flex flex-row md:justify-evenly items-center w-full gap-4">
                            <div onClick={() => window.open("https://scrollscan.com/token/")} className="flex flex-col justify-center items-center xl:w-[2.5rem] lg:w-[2.25rem] w-[2rem] hover:cursor-pointer">
                              <div className="flex flex-row justify-center items-center w-full">
                                <Image src={""} width={24} height={24} alt="" className="bg-black bg-opacity-[0.15] rounded-full xl:w-[2.5rem] lg:w-[2.25rem] w-[2rem] xl:h-[2.5rem] lg:h-[2.25rem] h-[2rem]"/> 
                              </div>
                              <span className="md:mt-3 mt-2 text-white text-xs">USDC</span>
                            </div>
                            {index != (routes.length - 1) && (
                              <RightArrowIcon className="xl:min-w-[2rem] lg:min-w-[1.75rem] min-w-[1.5rem] xl:min-h-[2rem] lg:min-h-[1.75rem] min-h-[1.5rem] xl:w-[2rem] lg:w-[1.75rem] w-[1.5rem] xl:h-[2rem] lg:h-[1.75rem] h-[1.5rem] p-[0.25rem] bg-white bg-opacity-5 rounded-full"/>
                            )}
                          </div>
                        ))}
                      </div>
                      <div onClick={() => setShowRouteModal(!showRouteModal)} className="flex justify-center items-center py-2 w-full xs:mt-4 mt-2 bg-black bg-opacity-[0.15] hover:bg-white hover:bg-opacity-10 hover:cursor-pointer transition duration-150 rounded-lg">
                        <span className="text-white xs:text-base text-sm">View detailed routing</span> 
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <Button
                variant="bordered"
                disabled={
                  isConnected &&
                  (!tokenFrom || !tokenTo || !swapAmount) &&
                  chain?.id === 534352
                }
                className={"w-full xs:mx-0 mx-2 md:p-4 sm:p-3 p-2 rounded-xl xl:text-xl sm:text-lg text-md font-semibold " + (isConnected && (!tokenFrom || !tokenTo || !swapAmount) && chain?.id === 534352 ? "opacity-50 pointer-events-none" : "")}
                onClick={() => (isConnected ? setIsSwapModalOpen(true) : open())}
              >
                {isConnected ? "SWAP" : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showFrom && (
          <TokenModal
            onSelectToken={(token: any) => {
              setTokenFrom(token);
              fetchBalanceFrom();
            }}
            onCloseModal={() => setShowFrom(false)}
            tokenList={tokens}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTo && (
          <TokenModal
            onSelectToken={(token: any) => setTokenTo(token)}
            onCloseModal={() => setShowTo(false)}
            tokenList={tokens}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRouteModal && (
          <RouteModal
            onCloseModal={() => setShowRouteModal(false)}
            routeList={[]}
          />
        )}
      </AnimatePresence>
      {/* {tokenFrom && tokenTo && isSwapModalOpen && chain?.id === 534352 ? ( */}
      {/* {tokenFrom && tokenTo && true ? (
        <SwapModal
          tokenA={tokenFrom}
          tokenB={tokenTo}
          amountA={+swapAmount}
          amountB={receiveAmount}
          swapParams={[]}
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
      ) : null} */}
    </div>
  );
};

export default SwapCard;
