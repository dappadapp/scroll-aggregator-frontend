import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, usePublicClient, useSwitchNetwork, useWaitForTransaction } from "wagmi";
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
import WethAbi from "@/constants/abis/weth.json";
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
// import { useRealTimeETHPrice } from "@/hooks/useRealTimeETHPrice";
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
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Tokens from "@/constants/tokens";

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
  // const ethPrice = useRealTimeETHPrice();
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
  const [translateRouteCard, setTranslateRouteCard] = useState({ x: 0, y: 0, xie: 0, yie: 0 });
  const initialWindowSizeSet = useRef(false);
  // const [offers, setOffers] = useState<DexOffer[]>([]);
  const [isMoreInformationVisible, setIsMoreInformationVisible] = useState(false);
  const [isMoreInformationVisibleAll, setIsMoreInformationVisibleAll] = useState(false);

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

    if (!tokensFetched.current) {
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

    if (!childlistFetched.current) {
      getChildlist();
    }

    return () => {
      childlistFetched.current = true;
    };
  }, [tokens]);

  useEffect(() => {
    if (!contracts || !signer) return;

    const aggregatorContract = new ethers.Contract(
      contracts.contract,
      AggregatorAbi,
      signer
    );

    setAggreContract(aggregatorContract);
  }, [contracts, signer])

  useEffect(() => {
    if (!tokens) return;

    setTokenFrom(native);
    setTokenTo(tokens.find((token: any) => token.symbol === "USDC"));
  }, [native, tokens]);

  useEffect(() => {
    if (!swapAmount || !tokenTo || !tokenFrom) return;  
    const generateBestRouteDataFunc = async () => {
      await generateBestRouteData(tokenFrom, tokenTo, swapAmount);
    };
    generateBestRouteDataFunc();

    if(Number(swapAmount) > 0 && String(swapAmount) != "") {
      setShowRouteModal(true);
    } else {
      setBestRouteData(undefined);
      setRoutes([]);
      setRoutesAndSpaces([]);
      setShowRouteModal(false);
    }

    setIsMoreInformationVisible(true);
  }, [swapAmount, tokenTo, tokenFrom]);

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

  const { data: allowance, refetch: fetchAllowance } = useContractRead({
    address: tokenFrom?.wrapped?.address,
    abi: ERC20TokenAbi,
    functionName: 'allowance',
    args: [account?.address, contracts?.contract],
    enabled: !!tokenFrom && !!account && !!contracts,
  });

  const generateBestRouteData = async (tokenIn: Currency, tokenOut: Currency, amountIn: string) => {
    if (!tokens || !tokenIn || !tokenOut || Number(amountIn) <= 0) return;

    const amountInParsed = BigInt(String(ethers.utils.parseUnits(amountIn, tokenIn?.wrapped?.decimals)));

    if(tokenFrom?.symbol == "WETH" && tokenTo?.symbol == "ETH") {
      setIsLoadingReceiveAmount(true);

      setTimeout(() => {
        let swapParamsConvertedToRoutes: SwapParams[][] = [];
        
        let route: SwapParams = {
          poolAddress: ethers.constants.AddressZero,
          tokenIn: tokenFrom?.wrapped?.address,
          tokenOut: tokenFrom?.wrapped?.address,
          amountIn: String(amountInParsed),
          amountOutMin: String(amountInParsed),
          fee: "300",
          path: ethers.constants.AddressZero,
          deadline: 0,
          isStable: false,
          convertToNative: true,
          swapType: -1
        };

        swapParamsConvertedToRoutes.push([]);
        swapParamsConvertedToRoutes[swapParamsConvertedToRoutes.length - 1].push(route);

        setRoutes(swapParamsConvertedToRoutes);

        let routesAndSpacesTemp = [];

        for (let i = 0; i < swapParamsConvertedToRoutes.length; i++) {
          routesAndSpacesTemp.push(swapParamsConvertedToRoutes[i]);

          if (i + 1 <= swapParamsConvertedToRoutes.length - 1) {
            routesAndSpacesTemp.push([]);
          }
        }

        setRoutesAndSpaces(routesAndSpacesTemp);

        setBestRouteData({
          swapParams: [],
          routePercentages: [],
          amountOuts: [BigInt(String(amountInParsed))],
          priceImpact: 0.01, 
          amountOut: Number(amountInParsed), 
          minAmountOut: Number(amountInParsed),
        });

        const swapAmountTemp = String(Number(amountIn).toFixed(6));
        setReceiveAmount(swapAmountTemp);

        const swapValue = tokenIn?.isNative || tokenFrom?.wrapped?.address === tokens![1].wrapped?.address ? ethers.utils.parseEther(amountIn) : BigInt(0);
        setSwapValue(String(swapValue));

        setIsLoadingReceiveAmount(false);
      }, 800);
    } else if(tokenFrom?.symbol == "ETH" && tokenTo?.symbol == "WETH") { 
      setIsLoadingReceiveAmount(true);

      setTimeout(() => {
        let swapParamsConvertedToRoutes: SwapParams[][] = [];
        
        let route: SwapParams = {
          poolAddress: ethers.constants.AddressZero,
          tokenIn: tokenFrom?.wrapped?.address,
          tokenOut: tokenFrom?.wrapped?.address,
          amountIn: String(amountInParsed),
          amountOutMin: String(amountInParsed),
          fee: "300",
          path: ethers.constants.AddressZero,
          deadline: 0,
          isStable: false,
          convertToNative: false,
          swapType: -1
        };

        swapParamsConvertedToRoutes.push([]);
        swapParamsConvertedToRoutes[swapParamsConvertedToRoutes.length - 1].push(route);

        setRoutes(swapParamsConvertedToRoutes);

        let routesAndSpacesTemp = [];

        for (let i = 0; i < swapParamsConvertedToRoutes.length; i++) {
          routesAndSpacesTemp.push(swapParamsConvertedToRoutes[i]);

          if (i + 1 <= swapParamsConvertedToRoutes.length - 1) {
            routesAndSpacesTemp.push([]);
          }
        }

        setRoutesAndSpaces(routesAndSpacesTemp);
        
        setBestRouteData({
          swapParams: [],
          routePercentages: [],
          amountOuts: [BigInt(String(amountInParsed))],
          priceImpact: 0.01, 
          amountOut: Number(amountInParsed), 
          minAmountOut: Number(amountInParsed),
        });

        const swapAmountTemp = String(Number(amountIn).toFixed(6));
        setReceiveAmount(swapAmountTemp);

        const swapValue = tokenIn?.isNative || tokenFrom?.wrapped?.address === tokens![1].wrapped?.address ? ethers.utils.parseEther(amountIn) : BigInt(0);
        setSwapValue(String(swapValue));

        setIsLoadingReceiveAmount(false);
      }, 800);
    } else {
      if(tokenIn?.wrapped?.address === tokenOut?.wrapped?.address) return;

      setIsLoadingReceiveAmount(true);
      
      const data = {
        chainId: ChainId.SCROLL_MAINNET,
        single: false,
        tokenInAddress: tokenIn?.wrapped?.address,
        tokenOutAddress: tokenOut?.wrapped?.address,
        amountIn: String(ethers.utils.parseUnits(amountIn, tokenIn?.decimals)),
        fee: DEFAULT_FEE,
        convertToNative: tokenOut.isNative,
        slippage: slippage,
        deadline: Math.floor(new Date().setMinutes(new Date().getMinutes() + 20) / 1000)
      };

      try {
        const response = await axios.post("/api/generateBestRouteData", data);
        const responseParsed = JSON.parse(response.data);

        if (responseParsed.swapParams.length == 0) {
          setMinimumReceived("0");
          setEstGasFee("0");
          setPriceImpact("0");
          setReceiveAmount("");
          setBestRouteData(undefined);
          setIsLoadingReceiveAmount(false);
          toast.error("Increase your swap amount or try the swap with different pairs", { toastId: 'swap' });
          return;
        }

        setReceiveAmount(Number(ethers.utils.formatUnits(responseParsed.amountOut, tokenOut?.decimals)).toFixed(6));
        setMinimumReceived(Number(ethers.utils.formatUnits(responseParsed.minAmountOut, tokenOut?.decimals)).toFixed(6));
        setPriceImpact(String(responseParsed.priceImpact < 0.01 ? 0.01 : responseParsed.priceImpact.toFixed(2)));

        const swapValue = tokenIn?.isNative || responseParsed.swapParams[0].tokenIn === tokens![1].wrapped?.address ? ethers.utils.parseEther(amountIn) : BigInt(0);
        setSwapValue(String(swapValue));

        let swapParamsConvertedToRoutes: any[] = [];
        let currentSwapParamsTokenIn = responseParsed.swapParams[0].tokenIn;

        for (let i = 0; i < responseParsed.swapParams.length; i++) {
          if (i == 0) {
            swapParamsConvertedToRoutes.push([]);
            swapParamsConvertedToRoutes[swapParamsConvertedToRoutes.length - 1].push(responseParsed.swapParams[i]);
          } else {
            if (responseParsed.swapParams[i].tokenIn !== currentSwapParamsTokenIn) {
              swapParamsConvertedToRoutes.push([]);
              swapParamsConvertedToRoutes[swapParamsConvertedToRoutes.length - 1].push(responseParsed.swapParams[i]);
              currentSwapParamsTokenIn = responseParsed.swapParams[i].tokenIn;
            }
          }
        }

        for (let i = 0; i < responseParsed.swapParams.length; i++) {
          for (let j = 0; j < swapParamsConvertedToRoutes.length; j++) {
            for (let k = 0; k < swapParamsConvertedToRoutes[j].length; k++) {
              if (responseParsed.swapParams[i] !== swapParamsConvertedToRoutes[j][k + 1] && responseParsed.swapParams[i].tokenIn === swapParamsConvertedToRoutes[j][k].tokenIn && responseParsed.swapParams[i].tokenOut === swapParamsConvertedToRoutes[j][k].tokenOut && responseParsed.swapParams[i].swapType !== swapParamsConvertedToRoutes[j][k].swapType) {
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

  }

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

  useEffect(() => {
    if (!tokenFrom || !tokenTo) return;

    if(tokenFrom!.symbol == "ETH" && tokenTo!.symbol == "WETH" || tokenFrom!.symbol == "WETH" && tokenTo!.symbol == "ETH") {
      setIsMoreInformationVisibleAll(false);
    } else {
      setIsMoreInformationVisibleAll(true);
    }

    if(!address) return;

    if (tokenFrom!.symbol == "ETH") {
      setApproved(true);
    } else if(tokenFrom!.symbol == "WETH") {
      if(!!allowance && !!swapAmount) {
        if (Number(ethers.utils.formatUnits(String(allowance), tokenFrom?.wrapped?.decimals)) >= Number(swapAmount)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      } else {
        setApproved(false);
      }

      fetchAllowance?.();
    } else {
      if(!!allowance && !!swapAmount) {
        if (Number(ethers.utils.formatUnits(String(allowance), tokenFrom?.wrapped?.decimals)) >= Number(swapAmount)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      } else {
        setApproved(false);
      }

      fetchAllowance?.();

      if (tokenFrom?.wrapped?.symbol === tokenTo?.wrapped?.symbol) return;
    }

    if (!swapAmount) return;

    const generateBestRouteDataFunc = async () => {
      await generateBestRouteData(tokenFrom, tokenTo, swapAmount);
    }

    generateBestRouteDataFunc();
  }, [allowance, swapAmount, slippage, refresh, tokenFrom, tokenTo]);

  const handleSwitchToken = async () => {
    if (!tokenTo || !tokenFrom) return;
    let tokenToA: Currency = tokenTo!;
    setTokenTo(tokenFrom);
    setTokenFrom(tokenToA);
    if (!swapAmount) return;
    const swapAmountTemp = String(Number(swapAmount).toFixed(6));
    setSwapAmount(swapAmountTemp);
    await generateBestRouteData(tokenToA!, tokenFrom!, swapAmountTemp);
  };

  const handleClickInputPercent = async (percent: number) => {
    if (percent == percentage) {
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
      setSwapAmount(((parseFloat(balance) *  percent) / 100).toFixed(6).toString());
      await generateBestRouteData(tokenFrom!, tokenTo!, ((parseFloat(balance) * percent) / 100).toFixed(6).toString());
      setReceiveAmount(((parseFloat(balance) * percent) / 100).toFixed(tokenTo?.decimals).toString());
      setChangeFrom(true);
    } else if (tokenFrom?.symbol == "ETH") {
      if (!balanceFrom || !tokenFrom) return;
      const balance = formatUnits(balanceFrom.value, tokenFrom?.decimals);
      setPercentage(percent);
      setSwapAmount(((parseFloat(balance) * (percent === 100 ? percent - 2.3 : percent)) / 100).toFixed(6).toString());
      await generateBestRouteData(tokenFrom!, tokenTo!, ((parseFloat(balance) * (percent === 100 ? percent - 2.3 : percent)) / 100).toFixed(6).toString());
      setChangeFrom(true);
    }
    else{
      if (!balanceFrom || !tokenFrom) return;
      const balance = formatUnits(balanceFrom.value, tokenFrom?.decimals);
      setPercentage(percent);
      setSwapAmount(((parseFloat(balance) * (percent === 100 ? percent - 0.00001 : percent)) / 100).toFixed(6).toString());
      await generateBestRouteData(tokenFrom!, tokenTo!, ((parseFloat(balance) * (percent === 100 ? percent - 0.00001 : percent)) / 100).toFixed(6).toString());
      setChangeFrom(true);
    }
  };

  const { config: configApprove } = usePrepareContractWrite({
    address: tokenFrom?.wrapped?.address,
    abi: ERC20TokenAbi,
    functionName: "approve",
    args: [contracts?.contract, ethers.utils.parseUnits(Number(swapAmount ? swapAmount : "0").toFixed(tokenFrom?.wrapped?.decimals), tokenFrom?.wrapped?.decimals)],
    enabled: !!contracts && !!tokenFrom && !!tokenTo && !!swapAmount && !!receiveAmount && Number(receiveAmount) > 0 && !!bestRouteData && !approved
  });

  const { data: dataApprove, writeAsync: onApprove } = useContractWrite(configApprove);

  const { isLoading: isLoadingApprove } = useWaitForTransaction({
    hash: dataApprove?.hash,
    onSuccess: () => {
      setApproved(true);
      fetchAllowance?.();
    },
    onError: () => {
      setApproved(false);
    }
  })

  const { config: configEthDeposit } = usePrepareContractWrite({
    address: !!tokens ? tokens[0].wrapped?.address : ethers.constants.AddressZero,
    abi: WethAbi,
    functionName: "deposit",
    args: [],
    value: BigInt(swapValue),
    enabled: !!tokens && !!contracts && !!tokenFrom && !!swapAmount && !!swapValue && !!bestRouteData && approved && tokenFrom?.symbol == "ETH" && tokenTo?.symbol == "WETH",
  });

  const { data: dataEthDeposit, writeAsync: onEthDeposit } = useContractWrite(configEthDeposit);

  const { isLoading: isLoadingEthDeposit } = useWaitForTransaction({
    hash: dataEthDeposit?.hash,
    onSuccess: () => {
      fetchBalanceFrom?.();
      fetchBalanceTo?.();
    }
  })

  const { config: configWethWithdraw } = usePrepareContractWrite({
    address: !!tokens ? tokens[0].wrapped?.address : ethers.constants.AddressZero,
    abi: WethAbi,
    functionName: "withdraw",
    args: [BigInt(swapValue)],
    enabled: !!tokens && !!contracts && !!tokenFrom && !!swapAmount && !!swapValue && !!bestRouteData && approved && tokenFrom?.symbol == "WETH" && tokenTo?.symbol == "ETH",
  });
  
  const { data: dataWethWithdraw, writeAsync: onWethWithdraw } = useContractWrite(configWethWithdraw);

  const { isLoading: isLoadingWethWithdraw } = useWaitForTransaction({
    hash: dataWethWithdraw?.hash,
    onSuccess: () => {
      fetchBalanceFrom?.();
      fetchBalanceTo?.();
    }
  })

  const { config: configSwap, error } = usePrepareContractWrite({
    address: contracts?.contract,
    abi: AggregatorAbi,
    functionName: "executeSwaps",
    args: [bestRouteData?.swapParams],
    value: BigInt(swapValue) | BigInt(0),
    //enabled: !!contracts && !!tokenFrom && !!swapAmount && !!swapValue && !!bestRouteData && approved && !(tokenFrom?.symbol == "WETH" && tokenTo?.symbol == "ETH") && !(tokenFrom?.symbol == "ETH" && tokenTo?.symbol == "WETH") && BigInt(swapValue) >= BigInt(String(balanceFrom?.value)),
  });

  const { data: dataSwap, writeAsync: onSwap } = useContractWrite(configSwap);

  const { isLoading: isLoadingSwap } = useWaitForTransaction({
    hash: dataSwap?.hash,
    
    onSuccess: () => {
      fetchBalanceFrom?.();
      fetchBalanceTo?.();
    }
  })

  const toggleMoreInformation = () => {
    setIsMoreInformationVisible(!isMoreInformationVisible);
  };

  useEffect(() => {
    if (!address || !tokenFrom || !tokenTo) return;
    fetchBalanceFrom?.();
    fetchBalanceTo?.();
  }, [address, tokenFrom, tokenTo, swapAmount]);

  const swapButtonDisableHandler = () => {
    if(isConnected && approved && chain?.id == ChainId.SCROLL_MAINNET) {
      if(isLoadingSwap || 
        isLoadingReceiveAmount || 
        isLoadingEthDeposit || 
        isLoadingWethWithdraw || 
        !tokens || 
        !tokenFrom || 
        !tokenTo || 
        !swapAmount
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const swapButtonOnClickHandler = async () => {
    if (isConnected) {
      if (chain?.id != ChainId.SCROLL_MAINNET) {
        switchNetwork?.(ChainId.SCROLL_MAINNET);
      } else {
        try{
        if (tokens && tokenFrom && tokenTo && swapAmount) {
          if (approved) {
            if(tokenFrom?.symbol == "ETH" && tokenTo?.symbol == "WETH") {
              onEthDeposit?.();
            } else if(tokenFrom?.symbol == "WETH" && tokenTo?.symbol == "ETH") {
              onWethWithdraw?.();
            } else {

              if (!onSwap) {
                console.log("error", error?.message);
                if (error?.message.includes("insufficient funds for gas * price + value")) {
                  return toast(
                    "You don't have enough balance for this transaction."
                  );
                }
                if (
                  error?.message.includes("Execution reverted for an unknown reason.")
                ) {
                  return toast(
                    "Execution reverted for an unknown reason."
                  );
                }          
                if(error?.message.includes("RPC Request failed")){
          
                return toast(
                  `Please connect your wallet to correct network and try again.`
                );
                }
                return toast("Insufficient funds for gas");
              }
              await onSwap?.();
            } 
          } else {
            onApprove?.();
          }
        }
      }
      catch(error) {
        console.log(error);
      }
      }
    } else {
      open();
    }
  }

  useEffect(() => {
    if (!window || typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (!initialWindowSizeSet.current) {
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
        setTranslateRouteCard({ x: 50, y: 10, xie: 40, yie: 50 });
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
        setTranslateRouteCard({ x: 40, y: 10, xie: 30, yie: 10 });
      } else {
        // setTranslateRouteCard({ x: 25, y: 50, xie: 15, yie: 50 });
        setTranslateRouteCard({ x: 37.5, y: 10, xie: 27.5, yie: 10 });
      }
    }
  }, [windowSize]);

  useEffect(() => {
    if(!routes) return;
    setShowRouteModal(true);
  }, [routes])

  useEffect(() => {
    if(!isLoadingReceiveAmount) return;
    setBestRouteData(undefined);
    setRoutes([]);
    setRoutesAndSpaces([]);
    setShowRouteModal(false);
  }, [isLoadingReceiveAmount])

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
                    {toFixedValue(balanceFrom.formatted, 6)} {balanceFrom.symbol}
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
                      onKeyDown={() => { }}
                      value={swapAmount ? swapAmount : ""}
                      type="number"
                      placeholder="Enter Amount"
                      className="xs:!w-full !w-[75%] crosschainswap-input text-end xs:mr-0 mr-2" // Increase the height here
                    />
                  </div>
                </div>
                <div className="flex flex-row flex-wrap justify-center items-center xl:gap-6 gap-2">
                  {percentageButtons.map((val, index) => (
                    <div
                      className={`${percentage === val ? "scale-[1.1] bg-white bg-opacity-5" : "scale-100"
                        } ${balanceFrom && balanceTo && Number(toFixedValue(balanceFrom!.formatted, 6)) > 0 ? "" : "pointer-events-none opacity-50"} group cursor-pointer bg-black select-none xl:px-2 xl:py-2 px-1 py-2 lg:w-[5rem] sm:w-[4.5rem] w-[3.25rem] rounded-full bg-opacity-[0.15] flex flex-col text-center sm:text-sm text-xs transition-all duration-150 hover:cursor-pointer hover:bg-white hover:bg-opacity-5`}
                      key={"perc-button-" + index}
                      onClick={() => handleClickInputPercent(val)}
                    >
                      <span
                        className={`-mb-1 group-hover:text-white ${percentage === val ? "text-[#EBC28E]" : "text-[white]/60"
                          } transition-all`}
                      >
                        {val}%
                      </span>
                    </div>
                  ))}
                </div>
                <AnimatePresence>
                  <motion.button
                    whileHover={{ rotate: 135, scale: 1.125, transition: { duration: 0.15 } }}
                    whileTap={{ rotate: 360, scale: 0.925, transition: { duration: 0.15 } }}
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
                    {toFixedValue(balanceTo.formatted, 6)} {balanceTo.symbol}
                  </div>
                )}
              </div>
              <div className="flex flex-col w-full lg:mt-6 md:mt-5 sm:mt-4 mt-3 sm:mb-2 xs:mb-0 mb-5">
                <div className="flex flex-row justify-between items-center relative sm:gap-8 xs:gap-6 gap-4 w-full">
                  <div className="flex justify-center items-center w-full">
                    <TokenSelect onClick={() => setShowTo(true)} token={tokenTo} loading={!tokens} />
                  </div>
                  <Input
                    value={toFixedValue(receiveAmount, 6)}
                    type="number"
                    loading={isLoadingReceiveAmount}
                    placeholder="Receive Amount"
                    className="xs:!w-full !w-[75%] crosschainswap-input text-end xs:mr-0 mr-2" // Increase the height here
                    disabled={true}
                  />
                </div>

                <div className={"flex justify-center items-center w-full md:mt-6 mt-4 md:mb-3 mb-0 " + (Number(swapAmount) == 0 || swapAmount == undefined || bestRouteData == undefined ? "" : "")}>
                <Button
                  variant="bordered"
                  disabled={swapButtonDisableHandler()}
                  className={"select-none uppercase w-full xs:mx-0 mx-2 md:p-4 sm:p-3 p-2 rounded-xl xl:text-xl sm:text-lg text-md font-semibold " + (swapButtonDisableHandler() ? "opacity-50 pointer-events-none" : "")}
                  onClick={swapButtonOnClickHandler}
                >
                  {(!approved && isLoadingApprove) || isLoadingSwap || isLoadingEthDeposit || isLoadingWethWithdraw ? (
                    <div className="flex justify-center text-white items-center">
                      <Loading className="animate-spin h-[1.25rem] w-[1.25rem]" />
                    </div>
                  ) : (
                    isConnected ? (chain?.id !== ChainId.SCROLL_MAINNET ? "Switch Network" : (approved ? "Swap" : "Approve")) : "Connect Wallet"
                  )}
                </Button>
              </div>
              {isMoreInformationVisibleAll && (
                <div onClick={toggleMoreInformation} className={`flex flex-col select-none justify-between md:p-5 p-3 md:mx-0 xs:mx-1 mx-2 md:mt-3 mt-4 bg-[#121419] bg-opacity-30 rounded-xl gap-1 hover:bg-white hover:bg-opacity-5 hover:cursor-pointer ${''}`}>
                  <div className="flex flex-row flex-wrap justify-between items-center w-full">
                    <span className="text-white xs:text-base text-sm">More Information</span>
                    <FaChevronDown className={"text-white transition-all duration-200 " + (isMoreInformationVisible ? "rotate-180" : "")} />
                  </div>
                  {isMoreInformationVisible && (
                    <div
                      className={`flex flex-col justify-between xs:p-4 p-2 md:mx-0 xs:mx-1 mx-2 bg-[#121419] bg-opacity-30 rounded-xl md:mt-3 mt-2 gap-1 ${''}`}
                    >
                      <div className="flex flex-row flex-wrap justify-between items-center w-full">
                        <span className="text-white xs:text-base text-sm">Minimum Received:</span>
                        {isLoadingReceiveAmount ? (
                          <div className="animate-pulse w-[35%] h-4 bg-white bg-opacity-5 rounded-full"></div>
                        ) : (
                          <span className="text-white xs:text-base text-sm">{Number(minimumReceived) > 0 ? (minimumReceived + " " + (tokenTo?.symbol ? tokenTo?.symbol : "TOKEN")) : "- " + (tokenTo?.symbol ? tokenTo?.symbol : "TOKEN")}</span>
                        )}
                      </div>
                      <div className="flex flex-row flex-wrap justify-between items-center w-full">
                        <span className="text-white xs:text-base text-sm">Slippage Tolerance:</span>
                        {isLoadingReceiveAmount ? (
                          <div className="animate-pulse w-[30%] h-4 bg-white bg-opacity-10 rounded-full"></div>
                        ) : (
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
                        ) : (
                          <span className={"xs:text-base text-sm " + (Number(priceImpact) > 0 ? "text-white" : (Number(priceImpact) < 0 ? "text-green-500" : "text-white"))}>{Number(priceImpact) > 0 ? ("-" + priceImpact + "%") : (Number(priceImpact) < 0 ? ("+" + priceImpact + "%") : "- %")}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
    
              </div>
    
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showFrom && (
            <TokenModal
              onSelectToken={async (token: any) => {
                if(token == tokenTo!) {
                  handleSwitchToken();
                } else {
                  setTokenFrom(token);
                }

                if (!!swapAmount && !!tokenTo) await generateBestRouteData(token, tokenTo!, swapAmount!);
                if (!!address) fetchBalanceFrom?.();
                if (!tokenTo) fetchAllowance?.();
              }}
              onCloseModal={() => setShowFrom(false)}
              tokenList={tokens!}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showTo && (
            <TokenModal
              onSelectToken={async (token: any) => {
                if(token == tokenFrom!) {
                  handleSwitchToken();
                } else {
                  setTokenTo(token);
                }

                if (!!swapAmount && !!tokenFrom) await generateBestRouteData(tokenFrom!, token, swapAmount!);
                if (!!address) fetchBalanceTo?.();
                if (!!tokenFrom) fetchAllowance?.();
              }}
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
        {showRouteModal && routes && bestRouteData && childlist && tokens && tokenFrom && translateRouteCard && tokenTo && (
          <RouteCard
            onCloseModal={() => setShowRouteModal(false)}
            routes={routes!}
            routesAndSpaces={routesAndSpaces!}
            childlist={childlist!}
            tokens={tokens!}
            routePercentages={bestRouteData!.routePercentages!}
            amountOuts={bestRouteData!.amountOuts}
            tokenFrom={tokenFrom!}
            tokenTo={tokenTo!}
            translateRouteCard={translateRouteCard}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwapCard;
