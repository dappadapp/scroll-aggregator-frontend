import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useBalance, useContractRead, useNetwork } from "wagmi";
import { readContract } from "@wagmi/core"
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
import SkydromePoolFactory from "@/constants/abis/skydrome.pool-factory.json";
import IziSwapPoolFactory from "@/constants/abis/iziSwapFactory.json";
import { type WalletClient, useWalletClient } from 'wagmi'
import { providers } from 'ethers'
type Props = {};

const percentageButtons = [25, 50, 75, 100];


 
export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: 534352,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}
 
/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  )
}

const SwapCard: React.FC<Props> = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const contractAddr = useContract();
  const [swapAmount, setSwapAmount] = useState("0");
  const [receiveAmount, setReceiveAmount] = useState("0");
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [dexType, setDexType] = useState<SWAP_TYPE>(SWAP_TYPE.SKYDROME);
  //TODO: Add tokens
  const [tokenFrom, setTokenFrom] = useState<Currency>();
  const [tokenTo, setTokenTo] = useState<Currency | undefined>(
    Tokens[ChainId.SCROLL_MAINNET]?.usdt
  );
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isChangeFrom, setChangeFrom] = useState(true);
  const [rate, setRate] = useState("0");
  const getCurrentRateTimeout = useRef<any>(null);
  const getTokenRateTimeout = useRef<any>(null);
  const [isLoadingSwapAmount, setIsLoadingSwapAmount] = useState(false);
  const [isLoadingReceiveAmount, setIsLoadingReceiveAmount] = useState(false);
  const [pairAddress, setPairAddress] = useState<string>();

  const { chain, chains } = useNetwork();
  const signer = useEthersSigner({ chainId: 534352 })

  console.log("Tokens", Tokens);
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



  // Instantiate the contract
const contract = new ethers.Contract(contractAddr?.skydrome?.poolFactory || "0x5300000000000000000000000000000000000004", SkydromePoolFactory, signer);

// Send a call to the getPair function using ethers.js
async function getPair() {
  try {
    const pair = await contract.functions.getPair( tokenFrom?.wrapped.address,
      tokenTo?.wrapped.address,
      false);
      console.log("Pair Address:", pair);
    return pair;

  } catch (error) {
    console.error("Error:", error);
  }
}
const contractIzumi = new ethers.Contract(contractAddr?.iziswap?.liquidityManager || "0x5300000000000000000000000000000000000004", IziSwapPoolFactory, signer);
async function getPool() {
  try {
    const pair = await contractIzumi.pool( tokenFrom?.wrapped.address,
      tokenTo?.wrapped.address,
      3000);
      console.log("Pair Address:", pair);
    return pair;
   
  } catch (error) {
    console.error("Error:", error);
  }
}

const { data: poolAddress, refetch } = useContractRead(
  dexType === SWAP_TYPE.SPACEFI
    ? {
        address: contractAddr?.spacefi?.poolFactory,
        abi: SpaceFiPoolFactoryAbi,
        functionName: "getPair",
        args: [tokenFrom?.wrapped.address, tokenTo?.wrapped.address],
        enabled: !!contractAddr && !!tokenFrom && !!tokenTo,
      }
    : dexType === SWAP_TYPE.SKYDROME
    ? {
        address: contractAddr?.skydrome?.poolFactory,
        abi: SkydromePoolFactory,
        functionName: "getPair",
        args: [
          tokenFrom?.wrapped.address,
          tokenTo?.wrapped.address,
          false,
        ],
        enabled: !!contractAddr && !!tokenFrom && !!tokenTo,
      }
    : dexType === SWAP_TYPE.IZUMI
    ? {
      address: contractAddr?.iziswap?.liquidityManager,
      abi: IziSwapPoolFactory,
      functionName: "pool",
      args: [
        tokenFrom?.wrapped.address,
        tokenTo?.wrapped.address,
        3000,
      ],
      }
    : {}
);

console.log("poolAddress", poolAddress);


  useEffect(() => {
    fetchBalanceFrom();
    fetchBalanceTo();
    refetch();
    
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
    if (
      (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") ||
      (tokenTo?.symbol == "ETH" && tokenFrom?.symbol == "WETH")
    ){
      setReceiveAmount(swapAmount);
    }
    else{
      getCurrentRate();
    }
   
  }, [tokenFrom,tokenTo]);

  const handleINChange = async(e: any) => {
    refetch();
    console.log("tokenTo in", tokenTo);
    console.log("tokenFrom in", tokenFrom);
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

  const handleOUTChange = async (e: any) => {
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

  const getCurrentRate = async() => {
    clearTimeout(getCurrentRateTimeout.current!);
    getCurrentRateTimeout.current = setTimeout(async () => {
      if (!tokenFrom || !tokenTo || !swapAmount || +swapAmount === 0) return;
      else {
        setIsLoadingReceiveAmount(true);

        const exchangeRate = await axios.post("/api/exchange", {
          amount: swapAmount.toString(),
          from: tokenFrom?.isNative ? tokenFrom.wrapped.address : tokenFrom?.address,
          fromDecimals: tokenFrom?.wrapped.decimals,
          to: tokenTo?.isNative ? tokenTo.wrapped.address : tokenTo?.address,
          toDecimals: tokenTo?.wrapped.decimals,
          type: "IN",
        });

        setDexType(
          exchangeRate?.data?.dex === "space-fi"
            ? SWAP_TYPE.SPACEFI
            : exchangeRate?.data?.dex === "skydrome"
            ? SWAP_TYPE.SKYDROME
            : SWAP_TYPE.IZUMI
        );
        setReceiveAmount(ethers.utils.formatUnits(exchangeRate?.data.amount, tokenTo.wrapped.decimals));
        setRate(ethers.utils.formatUnits(exchangeRate?.data.amount, tokenTo.wrapped.decimals));
        setIsLoadingReceiveAmount(false);

        if(exchangeRate?.data?.dex === "skydrome"){
          const pool = await getPair();
          console.log("pool", pool);
          if(pool)
            setPairAddress(pool[0]);
        }
        else if(exchangeRate?.data?.dex === "iziswap"){
          const pool = await getPool();
          console.log("pool", pool);
          if(pool)
            setPairAddress(pool?.toString());
        }
        else{
          if(poolAddress)
            setPairAddress(poolAddress?.toString());
        }
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
            : exchangeRate?.data?.dex === "skydrome"
            ? SWAP_TYPE.SKYDROME
            : SWAP_TYPE.IZUMI
        );
        setSwapAmount(ethers.utils.formatUnits(exchangeRate?.data.amount, tokenFrom.wrapped.decimals));
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
    <div className="w-full max-w-[600px] p-2 lg:p-8 gap-2 flex flex-col relative mx-auto pt-3">
      <div className={`w-full h-full gap-4 flex-1 flex justify-between flex-col`}>
        <div className="relative w-full flex flex-col">
          <div className="w-full flex flex-col lg:z-[2] bg-[rgba(26,29,36,0.80)] mb-[2px] backdrop-blur-[52px] rounded-[48px] p-8">
            <div className="flex justify-between items-center space-x-2 mt-4">
              <span className="text-[#FFF0DD]">You Sell</span>
              {balanceFrom && (
                <div className="text-right text-lg">
                  {toFixedValue(balanceFrom.formatted, 4)} {balanceFrom.symbol}
                </div>
              )}
            </div>
            <div className="rounded-lg flex w-full flex-col gap-4 mb-4 ">
              <div className="flex justify-between z-[6] lg:gap-8 items-center">
                <TokenSelect
                  onChange={setTokenFrom}
                  className="flex-1"
                  token={tokenFrom}
                />
                <Input
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) {
                      setSwapAmount("");
                    } else {
                      // is A Number
                      val = val >= 0 ? val : 0;
                      handleINChange(e);
                    }
                  }}
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
            className="w-16 h-16 lg:w-20 lg:h-20 p-4 lg:-my-6 lg:z-[2] cursor-pointer mx-auto rounded-full text-white flex items-center justify-center bg-[#29303D] hover:bg-opacity-40 transition-all"
          >
            <Image
              src={"/change-icon.svg"}
              width={24}
              height={24}
              className="h-6 w-6"
              alt="change-icon"
            />
          </button>
          <div className="w-full flex flex-col lgz-[1] bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[48px] p-8">
            <div className="flex justify-between items-center space-x-2 mt-4">
              <span className="text-[#FFF0DD]">You Buy</span>
              {balanceTo && (
                <div className="text-right text-lg">
                  {toFixedValue(balanceTo.formatted, 4)} {balanceTo.symbol}
                </div>
              )}
            </div>

            <div className="flex w-full lg:gap-8 justify-between items-center">
              <TokenSelect onChange={setTokenTo} token={tokenTo} />
              <Input
                onChange={(e) => handleOUTChange(e)}
                onKeyDown={onKeyDownReceiveAmount}
                value={receiveAmount}
                type="number"
                loading={isLoadingReceiveAmount}
                placeholder="Receive Amount"
                className="crosschainswap-input w-full text-end cursor-not-allowed"
                disabled={true}
              />
            </div>
            <Button
              variant="bordered"
              disabled={
                isConnected &&
                (!tokenFrom || !tokenTo || !swapAmount) &&
                chain?.id === 534352
              }
              className="w-full p-4 rounded-lg text-xl font-semibold mt-8 lg:mt-4"
              onClick={() => (isConnected ? setIsSwapModalOpen(true) : open())}
            >
              {isConnected ? "SWAP" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
      {tokenFrom && tokenTo && isSwapModalOpen && chain?.id === 534352 ? (
        <SwapModal
          pool={pairAddress as string}
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
