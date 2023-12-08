import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, usePublicClient, useSwitchNetwork } from "wagmi";
import { readContract } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import { Abi, formatUnits, zeroAddress } from "viem";
import _, { set } from "lodash";
import Input from "@/components/Input";
import Button from "@/components/Button";
import TokenSelect from "@/components/TokenSelect";
import useNativeCurrency from "@/hooks/useNativeCurrency";
import { prepareWriteContract } from '@wagmi/core'
// import Tokens from "@/constants/tokens";
import useContract from "@/hooks/useContract";
import { ChainId, Currency, ERC20Token, SWAP_TYPE, Token } from "@/types";
import SwapModal from "./SwapModal";
import SpaceFiPoolFactoryAbi from "@/constants/abis/spacefi.pool-factory.json";
import { toFixedValue } from "@/utils/address";
import { ethers } from "ethers";
import axios from "axios";
import Image from "next/image";
import AggregatorAbi from "@/constants/abis/aggregator.json";
import ERC20TokenAbi from "@/constants/abis/erc20Abi.json";
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
import { swapTypeMapping, SwapParams, Route, BestRouteData } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import RightArrowIcon from "@/assets/images/right-arrow.svg";
import { DEFAULT_FEE } from "@/constants/contracts";
import { estimateContractGas } from "viem/_types/actions/public/estimateContractGas";
import Loading from "@/assets/images/loading.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import RouteCard from "@/components/RouteCard";

type Props = {};

const percentageButtons = [25, 50, 75, 100];

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: ChainId.SCROLL_MAINNET,
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
  // return React.useMemo(
  //   () => (walletClient ? walletClientToSigner(walletClient) : undefined),
  //   [walletClient]
  // );
}

const SwapCard: React.FC<Props> = () => {
  const account = useAccount();
  const publicClient = usePublicClient();
  const { switchNetwork } = useSwitchNetwork();
  const { data: feeData, isError } = useFeeData()
  const { tokens, setTokens, childlist, setChildlist } = useGlobalContext();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const contracts = useContract();
  const [swapAmount, setSwapAmount] = useState<string | undefined>(undefined);
  const [receiveAmount, setReceiveAmount] = useState("");
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [dexType, setDexType] = useState<SWAP_TYPE>(SWAP_TYPE.SKYDROME);
  //TODO: Add tokens
  const [tokenFrom, setTokenFrom] = useState<Currency>();
  const [tokenTo, setTokenTo] = useState<Currency | undefined>();
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
  const signer: any = useEthersSigner({ chainId: ChainId.SCROLL_MAINNET });
  const ethPrice = useRealTimeETHPrice();
  const [ethUSD, setEthPrice] = useState<number>(0);
  const [fee, setFee] = useState<string>("0");
  const [swapValue, setSwapValue] = useState<string>("0");
  const [bestRouteData, setBestRouteData] = useState<BestRouteData | undefined>(undefined);
  const [routes, setRoutes] = useState<any[]>();
  const [routesAndSpaces, setRoutesAndSpaces] = useState<any[]>();
  const [minimumReceived, setMinimumReceived] = useState<string>("0");
  const [estGasFee, setEstGasFee] = useState<string>("0");
  const [priceImpact, setPriceImpact] = useState<string>("0");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [approved, setApproved] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [aggreContract, setAggreContract] = useState<any>();
  const { refresh, setRefresh } = useGlobalContext();
  const tokensFetched = useRef(false);
  const childlistFetched = useRef(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [translateRouteCard, setTranslateRouteCard] = useState({ x: 0, y: 0 , xie: 0, yie: 0 });
  const initialWindowSizeSet = useRef(false);
  // const [offers, setOffers] = useState<DexOffer[]>([]);

  const native = useNativeCurrency();

  useEffect(() => {
    const getTokens = async () => {
      const response = await axios.get("/api/getTokens");

      if (response) {
        let tokenList: Currency[] = [];
          
        response.data.map((token: any, index: any) => {
          const convertedToken = new ERC20Token(
            ChainId.SCROLL_MAINNET,
            token.address.find((address: { chainId: number; address: string; }) => address.chainId === ChainId.SCROLL_MAINNET).address,
            token.decimals,
            token.symbol,
            token.name,
            token.logo,
            token.projectLink
          );
          tokenList.push(convertedToken);
        });

        tokenList.unshift(native);
        setTokens(tokenList);
      }
    }
    
    if(!tokensFetched.current) {
      getTokens();
    }

    return () => {
      tokensFetched.current = true;
    };
  }, []);

  useEffect(() => {
    const getChildlist = async () => {
      const response = await axios.post("/api/getChildlist", { chainId: ChainId.SCROLL_MAINNET });

      if (response) {
          setChildlist(response.data);
      }
    }

    if(!childlistFetched.current) {
      getChildlist();
    }

    return () => {
      childlistFetched.current = true;
    };
  }, [tokens]);

  useEffect(() => {
    if(!contracts || !signer) return;
    
    const aggregatorContract = new ethers.Contract(
      contracts.contract,
      AggregatorAbi,
      signer
    );

    setAggreContract(aggregatorContract);
  }, [contracts, signer])

  useEffect(() => {
    if(!tokens) return;
    
    setTokenFrom(native);
    setTokenTo(tokens.find((token: any) => token.symbol === "USDC"));
  }, [native, tokens]);

  const {
    data: balanceFrom,
    isLoading: isLoadingBalanceFrom,
    refetch: fetchBalanceFrom,
  } = useBalance({
    address: address,
    ...(!tokenFrom?.isNative && {
      token: tokenFrom?.wrapped?.address,
    }),
    chainId: tokenFrom?.chainId,
    enabled: !!address && !!tokenFrom,
  });

  const {
    data: balanceTo,
    isLoading: isLoadingBalanceTo,
    refetch: fetchBalanceTo,
  } = useBalance({
    address: address,
    ...(!tokenTo?.isNative && {
      token: tokenTo?.wrapped?.address,
    }),
    chainId: tokenTo?.chainId,
    enabled: !!address && !!tokenTo,
  });

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
  //   getEthPrice();
  // }, [routes]);

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

  // const { config: executeSwapsConfig } = usePrepareContractWrite({
  //   address: contracts?.contract,
  //   abi: AggregatorAbi,
  //   functionName: 'executeSwaps',
  //   args: bestRouteData ? bestRouteData.swapParams : [],
  //   value: BigInt(swapValue),
  //   enabled: !!swapValue && !!bestRouteData && !!contracts?.contract,
  // });

  // useEffect(() => {
  //   console.log("executeSwapsConfig:" + executeSwapsConfig);
  // }, [executeSwapsConfig])

  const { data: allowance, refetch: fetchAllowance } = useContractRead({
    address: tokenFrom?.wrapped?.address,
    abi: ERC20TokenAbi,
    functionName: 'allowance',
    args: [account?.address, contracts?.contract],
    enabled: !!tokenFrom && !!account && !!contracts,
  });

  useEffect(() => {
    if(!allowance || !tokenFrom) return;

    if(Number(ethers.utils.formatUnits(String(allowance), tokenFrom?.wrapped?.decimals)) >= Number(swapAmount)) {
      setApproved(true);
    } else {
      setApproved(false);
    }
  }, [allowance]);

  const generateBestRouteData = async (tokenIn: Currency, tokenOut: Currency, amountIn: string) => {
    if(!!tokens && tokenIn?.wrapped?.address === tokenOut?.wrapped?.address || Number(amountIn) <= 0) return;

    setIsLoadingReceiveAmount(true);

    const data = {
      chainId: ChainId.SCROLL_MAINNET, 
      single: false, 
      tokenInAddress: tokenIn?.wrapped?.address, 
      tokenOutAddress: tokenOut?.wrapped?.address, 
      amountIn: String(ethers.utils.parseUnits(amountIn, tokenIn?.decimals)), 
      fee: DEFAULT_FEE, 
      slippage: slippage, 
      deadline: Math.floor(new Date().setMinutes(new Date().getMinutes() + 20) / 1000)
    };

    try {
      const response = await axios.post("/api/generateBestRouteData", data);
      const responseParsed = JSON.parse(response.data);

      if(responseParsed.swapParams.length == 0) {
        setMinimumReceived("0");
        setEstGasFee("0");
        setPriceImpact("0");
        setReceiveAmount("");
        setBestRouteData(undefined);
        setIsLoadingReceiveAmount(false);
        toast.error("Increase your swap amount or try the swap with different pairs", { toastId: 'swap' });
        return;
      }
  
      setReceiveAmount(Number(ethers.utils.formatUnits(responseParsed.amountOut, tokenOut?.decimals)).toFixed(5));
      setMinimumReceived(Number(ethers.utils.formatUnits(responseParsed.minAmountOut, tokenOut?.decimals)).toFixed(5));
      setPriceImpact(String(responseParsed.priceImpact < 0.01 ? 0.01 : responseParsed.priceImpact.toFixed(2)));
      
      const swapValue = tokenIn?.isNative || responseParsed.swapParams[0].tokenIn === tokens![1].wrapped?.address ? ethers.utils.parseEther(amountIn) : BigInt(0);
      setSwapValue(String(swapValue));
  
      let swapParamsConvertedToRoutes: any[] = [];
      let currentSwapParamsTokenIn = responseParsed.swapParams[0].tokenIn;
  
      for(let i = 0; i < responseParsed.swapParams.length; i++){
        if(i == 0) {
          swapParamsConvertedToRoutes.push([]);
          swapParamsConvertedToRoutes[swapParamsConvertedToRoutes.length - 1].push(responseParsed.swapParams[i]);
        } else {
          if(responseParsed.swapParams[i].tokenIn !== currentSwapParamsTokenIn) {
            swapParamsConvertedToRoutes.push([]);
            swapParamsConvertedToRoutes[swapParamsConvertedToRoutes.length - 1].push(responseParsed.swapParams[i]);
            currentSwapParamsTokenIn = responseParsed.swapParams[i].tokenIn;
          }
        }
      }
  
      for(let i = 0; i < responseParsed.swapParams.length; i++){
        for(let j = 0; j < swapParamsConvertedToRoutes.length; j++){
          for(let k = 0; k < swapParamsConvertedToRoutes[j].length; k++){
            if(responseParsed.swapParams[i] !== swapParamsConvertedToRoutes[j][k + 1] && responseParsed.swapParams[i].tokenIn === swapParamsConvertedToRoutes[j][k].tokenIn && responseParsed.swapParams[i].tokenOut === swapParamsConvertedToRoutes[j][k].tokenOut && responseParsed.swapParams[i].swapType !== swapParamsConvertedToRoutes[j][k].swapType) {
              swapParamsConvertedToRoutes[j].push(responseParsed.swapParams[i]);
            }
          }
        }
      }

      let finalRoute: SwapParams = {
        poolAddress: responseParsed.swapParams[responseParsed.swapParams.length - 1].poolAddress,
        tokenIn: responseParsed.swapParams[responseParsed.swapParams.length - 1].tokenOut,
        tokenOut: responseParsed.swapParams[responseParsed.swapParams.length - 1].tokenOut,
        amountIn: responseParsed.swapParams[responseParsed.swapParams.length - 1].amountIn,
        amountOutMin: responseParsed.swapParams[responseParsed.swapParams.length - 1].amountOutMin,
        fee: responseParsed.swapParams[responseParsed.swapParams.length - 1].fee,
        path: responseParsed.swapParams[responseParsed.swapParams.length - 1].path,
        deadline: responseParsed.swapParams[responseParsed.swapParams.length - 1].deadline,
        isStable: responseParsed.swapParams[responseParsed.swapParams.length - 1].isStable,
        convertToNative: responseParsed.swapParams[responseParsed.swapParams.length - 1].convertToNative,
        swapType: responseParsed.swapParams[responseParsed.swapParams.length - 1].swapType
      };
  
      swapParamsConvertedToRoutes.push([]);
      swapParamsConvertedToRoutes[swapParamsConvertedToRoutes.length - 1].push(finalRoute);
  
      setRoutes(swapParamsConvertedToRoutes);
  
      let routesAndSpacesTemp = [];
  
      for (let i = 0; i < swapParamsConvertedToRoutes.length; i++) {
        routesAndSpacesTemp.push(swapParamsConvertedToRoutes[i]);
      
        if (i + 1 <= swapParamsConvertedToRoutes.length - 1) {
          routesAndSpacesTemp.push([]);
        }
      }
  
      setRoutesAndSpaces(routesAndSpacesTemp);
      setBestRouteData(responseParsed);
      setIsLoadingReceiveAmount(false);
    } catch (error) {
      setMinimumReceived("0");
      setEstGasFee("0");
      setPriceImpact("0");
      setReceiveAmount("");
      setBestRouteData(undefined);
      setIsLoadingReceiveAmount(false);
      toast.error("Increase your swap amount or try the swap with different pairs", { toastId: 'swap' });
      return;
    }
  }
  
  // useEffect(() => {
  //   if(!approved || !bestRouteData || !contracts || !account || !swapAmount) return;
  //   getEstimatedGasFee();
  // }, [approved, bestRouteData, contracts, account]);

  // const getEstimatedGasFee = async () => {
  //   const gasEstimate = await publicClient.estimateContractGas({
  //     address: contracts!.contract,
  //     abi: AggregatorAbi,
  //     functionName: 'executeSwaps',
  //     args: [bestRouteData!.swapParams],
  //     account: account!.address!
  //   });

  //   const estimatedGasFee = BigInt(gasEstimate) * BigInt(feeData!.gasPrice!);
  //   setEstGasFee(String(Number(ethers.utils.formatEther(estimatedGasFee)).toFixed(4)));
  // }

  const handleINChange = async (e: any) => {
    if (
      (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") ||
      (tokenTo?.symbol == "ETH" && tokenFrom?.symbol == "WETH")
    ) {
      setSwapAmount(e.target.value);
      setReceiveAmount(e.target.value);
    } else {
      setSwapAmount(e.target.value);
    }

    fetchAllowance?.();
    await generateBestRouteData(tokenFrom!, tokenTo!, e.target.value);
  };

  // const getCurrentRate = async () => {
  //   clearTimeout(getCurrentRateTimeout.current!);
  //   getCurrentRateTimeout.current = setTimeout(async () => {
  //     if (!tokenFrom || !tokenTo || !swapAmount || +swapAmount === 0) return;
  //     else {
  //       setIsLoadingReceiveAmount(true);

  //       const exchangeRate = await axios.post("/api/exchange", {
  //         amount: swapAmount.toString(),
  //         from: tokenFrom?.isNative ? tokenFrom.wrapped?.address : tokenFrom?.address,
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
  //             tokenTo?.isToken ? tokenTo?.decimals : tokenTo.wrapped?.decimals
  //           )
  //           .toString()
  //       );
  //       setRate(
  //         ethers.utils.formatUnits(
  //           exchangeRate?.data[0]?.amount,
  //           tokenTo?.isToken ? tokenTo?.decimals : tokenTo.wrapped?.decimals
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
  //         from: tokenFrom?.isNative ? tokenFrom.wrapped?.address : tokenFrom?.address,
  //         to: tokenTo?.isNative ? tokenTo.wrapped?.address : tokenTo?.address,
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
  //         ethers.utils.formatUnits(exchangeRate?.data.amount, tokenFrom.wrapped?.decimals)
  //       );
  //       setIsLoadingSwapAmount(false);
  //     }
  //   }, 200);
  // };

  useEffect(() => {
    if(!tokenFrom || !address) return;

    if(tokenFrom!.symbol == "ETH") { 
      setApproved(true);
    } else {
      setApproved(false);
      fetchAllowance?.();
    }

    if(!swapAmount || !tokenTo || tokenFrom?.wrapped?.symbol === tokenTo?.wrapped?.symbol) return;

    const generateBestRouteDataFunc = async () => {
      await generateBestRouteData(tokenFrom, tokenTo, swapAmount);
    }

    generateBestRouteDataFunc();
  }, [slippage, refresh, tokenFrom, tokenTo]);

  const handleSwitchToken = async () => {
    if(!tokenTo || !tokenFrom) return;
    let tokenToA: Currency = tokenTo!;
    setTokenTo(tokenFrom);
    setTokenFrom(tokenToA);
    if(!swapAmount) return;
    const swapAmountTemp = String(Number(swapAmount).toFixed(5));
    setSwapAmount(swapAmountTemp);
    await generateBestRouteData(tokenToA!, tokenFrom!, swapAmountTemp);
  };

  const handleClickInputPercent = async (percent: number) => {
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
      setSwapAmount(((parseFloat(balance) * percent) / 100).toFixed(5).toString());
      await generateBestRouteData(tokenFrom!, tokenTo!, ((parseFloat(balance) * percent) / 100).toFixed(5).toString());
      setReceiveAmount(((parseFloat(balance) * percent) / 100).toFixed(tokenTo?.decimals).toString());
      setChangeFrom(true);
    } else {
      if (!balanceFrom || !tokenFrom) return;
      const balance = formatUnits(balanceFrom.value, tokenFrom?.decimals);
      setPercentage(percent);
      setSwapAmount(((parseFloat(balance) * percent) / 100).toFixed(5).toString());
      await generateBestRouteData(tokenFrom!, tokenTo!, ((parseFloat(balance) * percent) / 100).toFixed(5).toString());
      setChangeFrom(true);
    }
  };

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

  // const tokens: Currency[] = useMemo(() => {
  //   if (chain && Tokens[chain.id]) {
  //     const tokens = _.values(Tokens[chain.id]);
  //     return [native, ...tokens];
  //   } else {
  //     const tokens = _.values(Tokens[ChainId.SCROLL_MAINNET]);
  //     return [native, ...tokens];
  //   }
  //   return [];
  //   console.log(tokens);
  // }, [chain, native]);

  const { config: configApprove } = usePrepareContractWrite({
    address: tokenFrom?.wrapped?.address,
    abi: ERC20TokenAbi,
    functionName: "approve",
    args: [contracts?.contract, ethers.utils.parseUnits(Number(swapAmount ? swapAmount : "0").toFixed(tokenFrom?.wrapped?.decimals), tokenFrom?.wrapped?.decimals)],
    enabled: !!contracts && !!tokenFrom && !!tokenTo && !!swapAmount && !!receiveAmount && Number(receiveAmount) > 0 && !!bestRouteData && !approved
  });

  const { writeAsync: onApprove } = useContractWrite({
    ...configApprove,
    onSuccess: () => {
      setApproved(true);
    },
    onError: () => {
      setApproved(false);
    }
  });

  const { config: configSwap } = usePrepareContractWrite({
    address: contracts?.contract,
    abi: AggregatorAbi,
    functionName: "executeSwaps",
    args: [bestRouteData?.swapParams],
    value: BigInt(swapValue),
    enabled: !!contracts && !!tokenFrom && !!swapAmount && !!swapValue && !!bestRouteData && approved,
  });

  const { writeAsync: onSwap, isLoading: isLoadingSwap, isSuccess: isSuccessSwap } = useContractWrite(configSwap);

  useEffect(() => {
    if(!address || !tokenFrom || !tokenTo) return;
    fetchBalanceFrom?.();
    fetchBalanceTo?.();
  }, [isSuccessSwap])

  const swapButtonDisableHandler = () => {
    return isConnected && (isLoadingSwap || !tokens || !tokenFrom || !tokenTo || !swapAmount || !bestRouteData) && approved && chain?.id == ChainId.SCROLL_MAINNET;
  }

  const swapButtonOnClickHandler = () => {
    if(isConnected) {
      if(chain?.id != ChainId.SCROLL_MAINNET) {
        switchNetwork?.(ChainId.SCROLL_MAINNET);
      } else {
        if(tokens && tokenFrom && tokenTo && swapAmount) {
          if(approved) {
            onSwap?.();
          } else {
            onApprove?.();
          }
        }
      }
    } else {
      open();
    }
  }

  useEffect(() => {
    if(!window || typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if(!initialWindowSizeSet.current) {
      handleResize();
    } else {
      window.addEventListener("resize", handleResize);
    }
    
    return () => {
      if (initialWindowSizeSet.current) window.removeEventListener("resize", handleResize); 
      if (!initialWindowSizeSet.current) initialWindowSizeSet.current = true;
    };
  }, []); 

  useEffect(() => {
    if(windowSize.width <= 1280) {
      if(windowSize.width > 1024 && windowSize.width <= 1280) {
        setTranslateRouteCard({ x: 50, y: 50, xie: 40, yie: 50 });
      } else {
        setTranslateRouteCard({ x: 0, y: 0, xie: 0, yie: -10 });

        // if(windowSize.width > 768 && windowSize.width <= 1024) {
        // } else {
        //   if(windowSize.width > 640 && windowSize.width <= 768) {
        //   } else {
        //     if(windowSize.width > 425 && windowSize.width <= 640) {
        //     } else {
        //     }
        //   }
        // }
      }
    } else {
      if(windowSize.width > 1280 && windowSize.width <= 1535) {
        setTranslateRouteCard({ x: 40, y: 50, xie: 30, yie: 50 });
      } else {
        // setTranslateRouteCard({ x: 25, y: 50, xie: 15, yie: 50 });
        setTranslateRouteCard({ x: 37.5, y: 50, xie: 27.5, yie: 50 });
      }
    }
  }, [windowSize]);

  return (
    <div className="relative w-full md:min-h-[60rem] xs:min-h-[50rem] min-h-[40rem] flex lg:flex-row flex-col lg:justify-center justify-start lg:items-start items-center gap-0">
      <motion.div 
        initial={{
          left: "auto",
        }}
        animate={{
          left: showRouteModal ? (windowSize.width < 1536 ? "0" : "6rem") : "auto",
        }}
        transition={{
          delay: !showRouteModal ? 0.3 : 0,
          duration: 0.3,
        }}
        className={"lg:absolute relative h-fit xl:w-[520px] lg:w-[480px] md:w-[400px] sm:w-[360px] w-full xs:max-w-full max-w-[320px] py-2 gap-2 flex flex-col mx-auto " + (!showRouteModal ? "lg:px-6 px-2" : "lg:px-6 px-2")}
      >
        <div className={`relative w-full h-full gap-4 flex-1 flex justify-between flex-col`}>
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
                      <TokenSelect onClick={() => setShowFrom(true)} token={tokenFrom} loading={!tokens} />
                    </div>
                    <Input
                      onChange={(e) => {
                        setPercentage(0);
                        let val = parseInt(e.target.value, 10);
                        if (isNaN(val)) {
                          setSwapAmount("");
                        } else {  
                          val = val >= 0 ? val : 0;
                          handleINChange(e);
                        }
                      }}
                      onKeyDown={() => {}}
                      value={swapAmount ? swapAmount :  ""}
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
                        percentage === val ? "scale-[1.1] bg-white bg-opacity-5" : "scale-100"
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
                    <TokenSelect onClick={() => setShowTo(true)} token={tokenTo} loading={!tokens} />
                  </div>                
                  <Input
                    value={toFixedValue(receiveAmount, 5)}
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
                    {isLoadingReceiveAmount ? (
                      <div className="animate-pulse w-[35%] h-4 bg-white bg-opacity-5 rounded-full"></div>
                    ):(
                      <span className="text-white xs:text-base text-sm">{Number(minimumReceived) > 0 ?(minimumReceived + " " + (tokenTo?.symbol ? tokenTo?.symbol : "TOKEN")) : "- " + (tokenTo?.symbol ? tokenTo?.symbol : "TOKEN")}</span>
                    )}
                  </div>
                  <div className="flex flex-row flex-wrap justify-between items-center w-full">
                    <span className="text-white xs:text-base text-sm">Slippage Tolerance:</span>
                    {isLoadingReceiveAmount ? (
                      <div className="animate-pulse w-[30%] h-4 bg-white bg-opacity-10 rounded-full"></div>
                    ):(
                      <span className="text-white xs:text-base text-sm">{slippage + "%"}</span>
                    )}
                  </div>
                  {/* <div className="flex flex-row flex-wrap justify-between items-center w-full">
                    <span className="text-white xs:text-base text-sm">Est. Gas Fee:</span>
                    {isLoadingReceiveAmount ? (
                      <div className="animate-pulse w-[32.5%] h-4 bg-white bg-opacity-5 rounded-full"></div>
                    ):(
                      <span className="text-white xs:text-base text-sm">{Number(estGasFee) > 0 ?(estGasFee + " " + (native?.symbol ? native?.symbol : "TOKEN")) : "- " + (native?.symbol ? native?.symbol : "TOKEN")}</span>
                    )}
                  </div> */}
                  <div className="flex flex-row flex-wrap justify-between items-center w-full">
                    <span className="text-white xs:text-base text-sm">Price Impact:</span>
                    {isLoadingReceiveAmount ? (
                      <div className="animate-pulse w-[27.5%] h-4 bg-white bg-opacity-10 rounded-full"></div>
                    ):(
                      <span className={"xs:text-base text-sm " + (Number(priceImpact) > 0 ? "text-white" : (Number(priceImpact) < 0 ? "text-green-500" : "text-white")) }>{Number(priceImpact) > 0 ? ("<" + priceImpact + "%") : "- %"}</span>
                    )}
                  </div>
                </div>
                <div
                  className={"justify-between items-center md:p-5 sm:p-4 p-3 bg-[#121419] bg-opacity-30 w-full rounded-xl xs:mx-0 mx-2 mt-4 xs:mb-4 mb-2 " + 
                    (isLoadingReceiveAmount ? "animate-pulse items-center " : "") + 
                    (Number(swapAmount) == 0 || swapAmount == undefined || bestRouteData == undefined ? "hidden" : "flex flex-col")
                  }
                >
                  {isLoadingReceiveAmount ? (
                      <span className="text-[#EBC28E] animate-pulse self-center xs:text-base text-sm">
                        Finding best route...
                      </span>
                    ) : (
                      <>
                        <div className={"flex flex-row items-center md:gap-4 gap-6 md:overflow-x-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] " + (!!routes ? (routes.length < 3 ? "xs:justify-evenly justify-start xs:max-w-[100%] max-w-[95%] " : "sm:justify-evenly justify-start sm:max-w-[100%] max-w-[95%] ") : "sm:justify-evenly justify-start sm:max-w-[100%] max-w-[95%] ")  + (routes?.length == 2 && tokenFrom?.symbol != "ETH" ? "w-[60%]" : "w-full")}>
                          {tokenFrom?.symbol === "ETH" && (
                            <>
                              <div>
                                <div onClick={() => window.open("https://scrollscan.com/")} className="flex flex-col justify-center items-center xl:w-[2.5rem] lg:w-[2.25rem] w-[2rem] hover:cursor-pointer">
                                  <div className="flex flex-row justify-center items-center rounded-full xl:w-[2.5rem] lg:w-[2.25rem] w-[2rem] xl:h-[2.5rem] lg:h-[2.25rem] h-[2rem] overflow-clip">
                                    <Image src={String(tokens?.find(token => (token?.wrapped?.address == tokenFrom?.wrapped?.address))?.logo!)} width={24} height={24} alt="" className="bg-black bg-opacity-[0.15] p-[0.35rem] w-full h-full"/> 
                                  </div>
                                  <span className="md:mt-3 mt-2 text-white text-xs">ETH</span>
                                </div>
                              </div>
                              <div>
                                <RightArrowIcon className="xl:min-w-[2rem] lg:min-w-[1.75rem] min-w-[1.5rem] xl:min-h-[2rem] lg:min-h-[1.75rem] min-h-[1.5rem] xl:w-[2rem] lg:w-[1.75rem] w-[1.5rem] xl:h-[2rem] lg:h-[1.75rem] h-[1.5rem] p-[0.25rem] bg-white bg-opacity-5 rounded-full"/>
                              </div>
                            </>
                          )}
                          {routesAndSpaces?.map((route, index) => (
                            route.length > 0 ? (
                              <div key={"route-" + index}>
                                <div onClick={() => window.open("https://scrollscan.com/token/" + route[0].tokenIn)} className="flex flex-col justify-center items-center xl:w-[2.5rem] lg:w-[2.25rem] w-[2rem] hover:cursor-pointer">
                                  <div className="flex flex-row justify-center items-center rounded-full xl:w-[2.5rem] lg:w-[2.25rem] w-[2rem] xl:h-[2.5rem] lg:h-[2.25rem] h-[2rem] overflow-clip">
                                    <Image src={String(tokens?.find(token => (token?.symbol != "ETH") && (token?.wrapped?.address == route[0].tokenIn))?.logo!)} width={24} height={24} alt="" className="bg-black bg-opacity-[0.15] p-[0.35rem] w-full h-full"/> 
                                  </div>
                                  <span className="md:mt-3 mt-2 text-white text-xs">{tokens?.find(token => (token?.symbol != "ETH") && token?.wrapped?.address == route[0].tokenIn)?.symbol!}</span>
                                </div>
                              </div>
                            ):(
                              <div key={"route-right-icon-" + index}>
                                <RightArrowIcon className="xl:min-w-[2rem] lg:min-w-[1.75rem] min-w-[1.5rem] xl:min-h-[2rem] lg:min-h-[1.75rem] min-h-[1.5rem] xl:w-[2rem] lg:w-[1.75rem] w-[1.5rem] xl:h-[2rem] lg:h-[1.75rem] h-[1.5rem] p-[0.25rem] bg-white bg-opacity-5 rounded-full"/>
                              </div>
                            )
                          ))}
                        </div>
                        <div onClick={() => setShowRouteModal(!showRouteModal)} className="flex justify-center items-center py-2 w-full xs:mt-4 mt-2 bg-black bg-opacity-[0.15] hover:bg-white hover:bg-opacity-10 hover:cursor-pointer transition duration-150 rounded-lg">
                          <span className="text-white xs:text-base text-sm">{!showRouteModal ? 'View detailed routing' : 'Hide detailed routing'}</span> 
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
              <div className={"flex justify-center items-center w-full " + (Number(swapAmount) == 0 || swapAmount == undefined || bestRouteData == undefined ? "xs:mt-4 mt-2" : "")}>
                <Button
                  variant="bordered"
                  disabled={swapButtonDisableHandler()}
                  className={"select-none uppercase w-full xs:mx-0 mx-2 md:p-4 sm:p-3 p-2 rounded-xl xl:text-xl sm:text-lg text-md font-semibold " + (swapButtonDisableHandler() ? "opacity-50 pointer-events-none" : "")}
                  onClick={swapButtonOnClickHandler}
                >
                  {isLoadingSwap ? (
                    <div className="flex justify-center text-white items-center">
                      <Loading className="animate-spin h-[1.25rem] w-[1.25rem]"/>
                    </div>
                  ):( 
                    isConnected ? (chain?.id !== ChainId.SCROLL_MAINNET ? "Switch Network" : (approved ? "Swap" : "Approve")) : "Connect Wallet"
                  )}
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
                if(!!address && !!tokenFrom) fetchBalanceFrom?.();
              }}
              onCloseModal={() => setShowFrom(false)}
              tokenList={tokens!}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showTo && (
            <TokenModal
              onSelectToken={(token: any) => setTokenTo(token)}
              onCloseModal={() => setShowTo(false)}
              tokenList={tokens!}
            />
          )}
        </AnimatePresence>
        {/* <AnimatePresence>
          {showRouteModal && (
            <RouteModal
              onCloseModal={() => setShowRouteModal(false)}
              routes={routes!}
              routesAndSpaces={routesAndSpaces!}
              childlist={childlist!}
              tokens={tokens!}
              routePercentages={bestRouteData!.routePercentages}
              amountOuts={bestRouteData!.amountOuts}
              tokenFrom={tokenFrom!}
            />
          )}
        </AnimatePresence> */}
      </motion.div>
      <AnimatePresence>
        {showRouteModal && (
          <RouteCard
            onCloseModal={() => setShowRouteModal(false)}
            routes={routes!}
            routesAndSpaces={routesAndSpaces!}
            childlist={childlist!}
            tokens={tokens!}
            routePercentages={bestRouteData!.routePercentages}
            amountOuts={bestRouteData!.amountOuts}
            tokenFrom={tokenFrom!}
            translateRouteCard={translateRouteCard}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwapCard;
